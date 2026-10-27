package com.bar_raw_materials.services.exportItem;

import com.bar_raw_materials.dto.exportItem.CreateExportItemDTO;
import com.bar_raw_materials.entities.*;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Proves that concurrent exports from the same goods-receipt lot cannot oversell it.
 * Runs against H2 in MySQL mode (see src/test/resources/application.properties) because
 * Docker/Testcontainers is not required to build the project.
 */
@SpringBootTest
class ExportItemConcurrencyTest {
    private static final int THREADS = 8;
    private static final int QUANTITY_TAKE = 3;
    private static final int INITIAL_REMAIN = 10; // THREADS * QUANTITY_TAKE > INITIAL_REMAIN

    @Autowired
    private ExportItemService exportItemService;
    @Autowired
    private GoodsReceiptItemRepository grnItemRepository;
    @Autowired
    private PlatformTransactionManager transactionManager;
    @PersistenceContext
    private EntityManager entityManager;

    private TransactionTemplate tx;

    @Test
    void concurrentExportsFromSameLotNeverOversell() throws Exception {
        tx = new TransactionTemplate(transactionManager);
        Fixture fixture = tx.execute(status -> createFixture());

        ExecutorService pool = Executors.newFixedThreadPool(THREADS);
        CountDownLatch ready = new CountDownLatch(THREADS);
        CountDownLatch start = new CountDownLatch(1);
        // every request reads the lot before any of them writes, which makes the
        // read-modify-write race deterministic instead of depending on thread timing
        CyclicBarrier allHaveReadTheLot = new CyclicBarrier(THREADS);

        List<Future<Throwable>> outcomes = new ArrayList<>();
        for (int i = 0; i < THREADS; i++) {
            int salesItemId = fixture.salesItemIds().get(i);
            outcomes.add(pool.submit(() -> {
                ready.countDown();
                start.await();
                try {
                    tx.executeWithoutResult(status -> {
                        grnItemRepository.findById(fixture.grnItemId().intValue());
                        awaitBarrier(allHaveReadTheLot);
                        exportItemService.create(
                                new CreateExportItemDTO(fixture.grnItemId(), QUANTITY_TAKE, salesItemId)
                        );
                    });
                    return null;
                } catch (Throwable t) {
                    return t;
                }
            }));
        }
        ready.await();
        start.countDown();

        List<Throwable> failures = new ArrayList<>();
        int successes = 0;
        for (Future<Throwable> outcome : outcomes) {
            Throwable failure = outcome.get(60, TimeUnit.SECONDS);
            if (failure == null) {
                successes++;
            } else {
                failures.add(failure);
            }
        }
        pool.shutdown();

        int remain = tx.execute(status ->
                entityManager.find(GoodsReceiptItem.class, fixture.grnItemId()).getQuantityRemain());
        int totalTaken = tx.execute(status -> entityManager.createQuery(
                "SELECT COALESCE(SUM(e.quantityTake), 0) FROM ExportItemDetail e WHERE e.grnItem.id = :id",
                Long.class).setParameter("id", fixture.grnItemId()).getSingleResult().intValue());

        assertThat(remain).as("remaining stock").isGreaterThanOrEqualTo(0);
        assertThat(totalTaken).as("total quantity taken from the lot").isLessThanOrEqualTo(INITIAL_REMAIN);
        assertThat(totalTaken).as("committed exports").isEqualTo(successes * QUANTITY_TAKE);
        assertThat(remain).as("remaining stock matches committed exports").isEqualTo(INITIAL_REMAIN - totalTaken);
        assertThat(successes).as("at least one export succeeds").isPositive();
        assertThat(failures).as("losers fail with an optimistic locking error")
                .isNotEmpty()
                .allSatisfy(f -> assertThat(f).isInstanceOf(ObjectOptimisticLockingFailureException.class));

        // the losers' whole transaction was rolled back: their sales items are untouched
        List<SalesOrderItem> salesItems = tx.execute(status -> entityManager.createQuery(
                "SELECT s FROM SalesOrderItem s WHERE s.id IN :ids", SalesOrderItem.class)
                .setParameter("ids", fixture.salesItemIds()).getResultList());
        assertThat(salesItems.stream().filter(s -> s.getQuantitySold() > 0)).hasSize(successes);
        assertThat(salesItems.stream().filter(s -> s.getQuantitySold() == 0))
                .hasSize(failures.size())
                .allSatisfy(s -> assertThat(s.getCogs()).isNull());
    }

    @AfterEach
    void cleanUp() {
        if (tx == null) {
            return;
        }
        tx.executeWithoutResult(status -> {
            for (String entity : List.of(
                    "ExportItemDetail", "SalesOrderItem", "SalesOrder", "Customer", "GoodsReceiptItem",
                    "Batch", "GoodsReceiptNote", "Product", "Category", "BaseUnit", "Vendor",
                    "BusinessPeriod", "User", "Role")) {
                entityManager.createQuery("DELETE FROM " + entity).executeUpdate();
            }
        });
    }

    private static void awaitBarrier(CyclicBarrier barrier) {
        try {
            barrier.await(30, TimeUnit.SECONDS);
        } catch (InterruptedException | BrokenBarrierException | TimeoutException e) {
            throw new IllegalStateException("threads did not reach the barrier", e);
        }
    }

    private record Fixture(Integer grnItemId, List<Integer> salesItemIds) {}

    private Fixture createFixture() {
        Role role = new Role();
        role.setRole("staff");
        persist(role);

        User user = new User();
        user.setUsername("tester");
        user.setPassword("not-used");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("tester@example.com");
        user.setPhoneNumber("0900000000");
        user.setRole(role);
        user.setTokenVersion(0);
        persist(user);

        BusinessPeriod period = new BusinessPeriod(
                "MONTH", LocalDate.now().withDayOfMonth(1), LocalDate.now().plusMonths(1), "test period");
        persist(period);

        Vendor vendor = new Vendor();
        vendor.setName("Test vendor");
        vendor.setTaxCode("0100000000");
        persist(vendor);

        BaseUnit baseUnit = new BaseUnit();
        baseUnit.setName("gram");
        baseUnit.setNotation("g");
        persist(baseUnit);

        Category category = new Category();
        category.setName("Coffee");
        persist(category);

        Product product = new Product();
        product.setSku("SKU-1");
        product.setName("Espresso beans");
        product.setBaseUnit(baseUnit);
        product.setPackSize(BigDecimal.ONE);
        product.setCategory(category);
        persist(product);

        GoodsReceiptNote grn = new GoodsReceiptNote();
        grn.setVendor(vendor);
        grn.setCreatedBy(user);
        grn.setBusinessPeriod(period);
        grn.setDateCreate(Instant.now());
        grn.setInvoiceNumber("INV-1");
        persist(grn);

        Batch batch = new Batch();
        batch.setProduct(product);
        batch.setMfgDate(LocalDate.now().minusDays(10));
        batch.setExpDate(LocalDate.now().plusMonths(6));
        batch.setLotNumber("LOT-1");
        batch.setIsDisposed(false);
        persist(batch);

        GoodsReceiptItem grnItem = new GoodsReceiptItem();
        grnItem.setProduct(product);
        grnItem.setGrn(grn);
        grnItem.setBatch(batch);
        grnItem.setQuantityImport(INITIAL_REMAIN);
        grnItem.setQuantityRemain(INITIAL_REMAIN);
        grnItem.setUnitCost(new BigDecimal("12.50"));
        grnItem.setVatRate(0.08f);
        persist(grnItem);

        Customer customer = new Customer();
        customer.setName("Walk-in");
        customer.setDateCreated(Instant.now());
        customer.setCustomerRank("bronze");
        persist(customer);

        SalesOrder salesOrder = new SalesOrder();
        salesOrder.setCustomer(customer);
        salesOrder.setCreatedBy(user);
        salesOrder.setBusinessPeriod(period);
        salesOrder.setDateCreated(Instant.now());
        salesOrder.setTotalAmount(BigDecimal.ZERO);
        persist(salesOrder);

        // one sales item per thread, so the only contended row is the goods-receipt lot
        List<Integer> salesItemIds = new ArrayList<>();
        for (int i = 0; i < THREADS; i++) {
            SalesOrderItem salesItem = new SalesOrderItem();
            salesItem.setProduct(product);
            salesItem.setSalesOrder(salesOrder);
            salesItem.setQuantitySold(0);
            salesItem.setUnitPrice(new BigDecimal("30.00"));
            salesItem.setDiscount(0f);
            salesItem.setVatRate(0.08f);
            salesItem.setNote("");
            persist(salesItem);
            salesItemIds.add(salesItem.getId());
        }
        return new Fixture(grnItem.getId(), salesItemIds);
    }

    private void persist(Object entity) {
        entityManager.persist(entity);
    }
}

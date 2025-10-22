package com.bar_raw_materials.services.businessPeriod;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.repositories.BusinessPeriodRepository;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import com.bar_raw_materials.repositories.ProductRepository;
import com.bar_raw_materials.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BusinessPeriodServiceImpl implements BusinessPeriodService {
    private final BusinessPeriodRepository businessPeriodRepository;
    private final DateTimeUtils dateTimeUtils;
    private final ProductRepository productRepository;
    private final ProductInventoryRepository productInventoryRepository;

    @Override
    public List<BusinessPeriod> getAll() {
        return businessPeriodRepository.findAll();
    }

    @Override
    public Page<BusinessPeriod> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return businessPeriodRepository.findAll(pageable);
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }

    @Override
    public BusinessPeriod getCurrent() {
        return businessPeriodRepository.getCurrent();
    }

    @Override
    public BusinessPeriod createPeriod() {
        LocalDate today = LocalDate.now();
        int quarter = dateTimeUtils.getQuarter(today);
        int year = today.getYear();

        LocalDate getStartDate = dateTimeUtils.getStart(quarter, year);
        LocalDate getEndDate = dateTimeUtils.getEnd(quarter, year);

        String periodType = "QUARTER";
        String label = "Quý " + quarter + ", năm " + year;

        BusinessPeriod businessPeriod = new BusinessPeriod(
                periodType,
                getStartDate,
                getEndDate,
                label
        );
        return businessPeriodRepository.save(businessPeriod);
    }

    @Override
    public List<ProductInventory> getAllCurrentPeriodProductINVs() {
        BusinessPeriod businessPeriod = getCurrent();
        return productInventoryRepository.findAllByPeriod(businessPeriod.getId());
    }

    @Override
    @Transactional
    public void createPeriodWithProductInventories() {
       BusinessPeriod businessPeriod = createPeriod();

        List<Product> products = productRepository.findAllOrderByProductIdAsc();
        List<ProductInventory> productInventories = new ArrayList<>();
        for (Product product : products) {
            productInventories.add(new ProductInventory(
                    product,
                    businessPeriod
            ));
        }
        // bulk update
        productInventoryRepository.saveAll(productInventories);
    }

    @Override
    @Transactional
    public void endOfPeriod() {
        // get current period inventories
        BusinessPeriod businessPeriod = getCurrent();
        List<ProductInventory> productINVs = productInventoryRepository.findAllByPeriod(businessPeriod.getId());

        // create new period
        BusinessPeriod nextPeriod = createPeriod();
        List<ProductInventory> nextPeriodINVs = new ArrayList<>();
        for (ProductInventory productInv : productINVs) {
            ProductInventory nextProductInv = getNextProductInv(productInv, nextPeriod);
            nextPeriodINVs.add(nextProductInv);
        }
        productInventoryRepository.saveAll(nextPeriodINVs);
    }

    private static ProductInventory getNextProductInv(ProductInventory productInv, BusinessPeriod nextPeriod) {
        Integer endingQuantity = productInv.getStartingQuantity() + productInv.getImportQuantity() - productInv.getExportQuantity();
        BigDecimal endingInventory = productInv.getStartingInventory().
                add(productInv.getImportAmount()).
                subtract(productInv.getCogs());
        return new ProductInventory(
                productInv.getProduct(),
                nextPeriod,
                endingQuantity,
                endingInventory
        );
    }
}

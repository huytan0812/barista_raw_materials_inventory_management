package com.bar_raw_materials.services.salesOrder;

import com.bar_raw_materials.dto.productInventory.ExportValueDTO;
import com.bar_raw_materials.dto.salesOrder.CreateSalesOrderDTO;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.entities.*;
import com.bar_raw_materials.exceptions.customer.CustomerDoesNotExistException;
import com.bar_raw_materials.exceptions.salesOrder.SalesOrderDoesNotExistException;
import com.bar_raw_materials.services.customer.CustomerService;
import com.bar_raw_materials.repositories.SalesOrderRepository;
import com.bar_raw_materials.services.businessPeriod.BusinessPeriodService;
import com.bar_raw_materials.utils.AuthUtils;
import com.bar_raw_materials.repositories.SalesOrderItemRepository;
import com.bar_raw_materials.repositories.ExportItemDetailRepository;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import com.bar_raw_materials.entities.ProductInventory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SalesOrderServiceImpl implements SalesOrderService{
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesItemRepository;
    private final ExportItemDetailRepository expItemRepository;
    private final GoodsReceiptItemRepository grnItemRepository;
    private final ProductInventoryRepository prdInvRepository;
    private final CustomerService customerService;
    private final BusinessPeriodService businessPeriodService;
    private final AuthUtils authUtils;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<SalesOrderDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return salesOrderRepository.findAllSalesOrderDTO(pageable);
    }

    @Override
    public SalesOrderDTO getDetails(int id) {
        return salesOrderRepository.findById(id);
    }

    @Override
    public SalesOrder getSalesOrder(int id) {
        return salesOrderRepository.findSalesOrderById(id);
    }

    @Override
    public SalesOrder getSalesOrderAlongCustomer(int id) {
        return salesOrderRepository.findSalesOrderAlongCustomer(id);
    }

    @Override
    @Transactional
    public void deleteSalesOrder(int id) {
        SalesOrder salesOrder = salesOrderRepository.findSalesOrderById(id);
        if (salesOrder == null) {
            throw new SalesOrderDoesNotExistException("Phiếu xuất kho không tồn tại");
        }
        // get list of SalesOrderItem by salesOrderId
        List<SalesOrderItem> salesItems = salesItemRepository.findAllBySalesOrderId(id);
        for (SalesOrderItem salesItem : salesItems) {
            // get list of Export Items by salesItemId
            List<ExportItemDetail> expItems = expItemRepository.findAllBySalesOrderItemId(salesItem.getId());
            for (ExportItemDetail expItem : expItems) {
                // return quantityTake back to grnItem's quantityRemain
                GoodsReceiptItem grnItem = expItem.getGrnItem();
                grnItem.setQuantityRemain(grnItem.getQuantityRemain() + expItem.getQuantityTake());
                grnItemRepository.save(grnItem);
            }
            expItemRepository.deleteAll(expItems);
        }
        salesItemRepository.deleteAll(salesItems);
        salesOrderRepository.delete(salesOrder);
    }

    @Override
    public void confirmSalesOrder(int id) {
        SalesOrder salesOrder = salesOrderRepository.findSalesOrderById(id);
        if (salesOrder == null) {
            throw new SalesOrderDoesNotExistException("Phiếu xuất kho không tồn tại");
        }
        List<Integer> productIds = new ArrayList<>();
        List<SalesOrderItem> salesItems = salesItemRepository.findAllBySalesOrderId(id);
        // productId as key
        Map<Integer, ExportValueDTO> exportValues = new HashMap<>();
        // used for update totalAmount in Sales Order
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SalesOrderItem salesItem : salesItems) {
            // only get distinct productIds
            if (!productIds.contains(salesItem.getProduct().getId())) {
                productIds.add(salesItem.getProduct().getId());
            }
            if (exportValues.containsKey(salesItem.getProduct().getId())) {
                ExportValueDTO exportValue = exportValues.get(salesItem.getProduct().getId());
                // update export quantity
                exportValue.setExportQuantity(
                        exportValue.getExportQuantity() + salesItem.getQuantitySold()
                );

                // update cogs
                exportValue.setCogs(
                        exportValue.getCogs().add(salesItem.getCogs())
                );

                // update revenue
                BigDecimal unitPrice = salesItem.getUnitPrice();
                BigDecimal discount = unitPrice.multiply(
                        BigDecimal.valueOf(salesItem.getDiscount())
                ).multiply(BigDecimal.valueOf(salesItem.getQuantitySold()));
                BigDecimal revenue = unitPrice.multiply(
                        BigDecimal.valueOf(salesItem.getQuantitySold())
                ).subtract(discount);
                exportValue.setRevenue(
                        exportValue.getRevenue().add(revenue)
                );

                // update for total amount field in SalesOrder
                totalAmount = totalAmount.add(
                        revenue.multiply(
                                BigDecimal.valueOf(1 + salesItem.getVatRate())
                        )
                );
            }
            else {
                ExportValueDTO exportValue = new ExportValueDTO();
                // set export quantity
                exportValue.setExportQuantity(salesItem.getQuantitySold());

                // set cogs
                exportValue.setCogs(
                        salesItem.getCogs()
                );

                // set revenue
                BigDecimal unitPrice = salesItem.getUnitPrice();
                BigDecimal discount = unitPrice.multiply(
                        BigDecimal.valueOf(salesItem.getDiscount())
                ).multiply(BigDecimal.valueOf(salesItem.getQuantitySold()));
                BigDecimal revenue = unitPrice.multiply(
                        BigDecimal.valueOf(salesItem.getQuantitySold())
                ).subtract(discount);
                exportValue.setRevenue(revenue);
                exportValues.put(salesItem.getProduct().getId(), exportValue);

                // set totalAmount for SalesOrder
                totalAmount = totalAmount.add(
                        revenue.multiply(
                                BigDecimal.valueOf(1 + salesItem.getVatRate())
                        )
                );
            }
        }
        // get list of product inventories
        List<ProductInventory> productInventories = prdInvRepository.findAllByProductIds(productIds);
        for (ProductInventory p : productInventories) {
            if (exportValues.containsKey(p.getProduct().getId())) {
                ExportValueDTO exportValue = exportValues.get(p.getProduct().getId());
                // set export quantity for product inventory
                p.setExportQuantity(
                        p.getExportQuantity() + exportValue.getExportQuantity()
                );
                // set cogs
                p.setCogs(
                        p.getCogs().add(exportValue.getCogs())
                );
                // set revenue
                p.setRevenue(
                        p.getRevenue().add(exportValue.getRevenue())
                );
            }
        }
        prdInvRepository.saveAll(productInventories);
        salesOrder.setTotalAmount(totalAmount);
        salesOrderRepository.save(salesOrder);
    }

    @Override
    public SalesOrder addSalesOrder(CreateSalesOrderDTO createSalesOrderDTO) {
        SalesOrder salesOrder = new SalesOrder();
        Customer customer = customerService.getDetails(createSalesOrderDTO.getCustomerId());
        if (customer == null) {
            throw new CustomerDoesNotExistException("Khách hàng không tồn tại");
        }

        BeanUtils.copyProperties(createSalesOrderDTO, salesOrder);
        salesOrder.setCustomer(customer);
        User currentUser = authUtils.getCurrentAuthorizedUser();
        salesOrder.setCreatedBy(currentUser);
        BusinessPeriod currentBp = businessPeriodService.getCurrent();
        salesOrder.setBusinessPeriod(currentBp);
        salesOrder.setDateCreated(Instant.now());
        salesOrder.setTotalAmount(BigDecimal.ZERO);
        return salesOrderRepository.save(salesOrder);
    }
}

package com.bar_raw_materials.services.salesOrderItem;

import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.repositories.SalesOrderItemRepository;
import com.bar_raw_materials.services.salesOrder.SalesOrderService;
import com.bar_raw_materials.exceptions.salesOrder.SalesOrderDoesNotExistException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesOrderItemServiceImpl implements SalesOrderItemService {
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final SalesOrderService salesOrderService;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<SalesOrderItem> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return salesOrderItemRepository.findAll(pageable);
    }

    @Override
    public Page<SalesOrderItemDTO> getPageBySalesOrderId(Integer salesOrderId, int page, int size) {
        SalesOrderDTO salesOrderDTO = salesOrderService.getDetails(salesOrderId);
        if (salesOrderDTO == null) {
            throw new RuntimeException("Phiếu xuất kho không tồn tại");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return salesOrderItemRepository.findBySalesOrderId(salesOrderId, pageable);
    }

    @Override
    public SalesOrderItemDTO create(Integer salesOrderId) {
        SalesOrder salesOrder = salesOrderService.getSalesOrder(salesOrderId);
        if (salesOrder == null) {
            throw new SalesOrderDoesNotExistException("Phiếu xuất kho không tồn tại");
        }
        SalesOrderItem salesOrderItem = new SalesOrderItem();
        salesOrderItem.setSalesOrder(salesOrder);
        salesOrderItem.setQuantitySold(0);
        salesOrderItem.setUnitPrice(BigDecimal.ZERO);
        salesOrderItem.setDiscount(0f);
        salesOrderItem.setVatRate(0f);
        salesOrderItem.setNote("");
        SalesOrderItem newSalesOrderItem = salesOrderItemRepository.save(salesOrderItem);
        SalesOrderItemDTO salesOrderItemDTO = new SalesOrderItemDTO();
        salesOrderItemDTO.setId(newSalesOrderItem.getId());
        salesOrderItemDTO.setSalesOrderId(salesOrderId);
        return salesOrderItemDTO;
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }
}

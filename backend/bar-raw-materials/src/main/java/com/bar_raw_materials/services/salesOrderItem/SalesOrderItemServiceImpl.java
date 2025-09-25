package com.bar_raw_materials.services.salesOrderItem;

import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.dto.salesOrderItem.CreateSalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.UpdateSalesOrderItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.exceptions.product.ProductDoesNotExistException;
import com.bar_raw_materials.exceptions.salesItem.SalesOrderItemDoesNotExistException;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.repositories.SalesOrderItemRepository;
import com.bar_raw_materials.services.salesOrder.SalesOrderService;
import com.bar_raw_materials.exceptions.salesOrder.SalesOrderDoesNotExistException;
import com.bar_raw_materials.repositories.ExportItemDetailRepository;
import com.bar_raw_materials.repositories.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Bean;
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
    private final ExportItemDetailRepository expItemRepository;
    private final GoodsReceiptItemRepository grnItemRepository;
    private final ProductRepository productRepository;
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
    @Transactional
    public void confirmSalesOrderItem(int salesItemId, CreateSalesOrderItemDTO createSalesItem) {
        SalesOrderItem salesItem = salesOrderItemRepository.findById(salesItemId);
        if (salesItem == null) {
            throw new SalesOrderItemDoesNotExistException("Đơn hàng xuất kho không tồn tại");
        }
        Product product = productRepository.findById(createSalesItem.getProductId());
        if (product == null) {
            throw new ProductDoesNotExistException("Sản phẩm không tồn tại");
        }
        salesItem.setProduct(product);
        BeanUtils.copyProperties(createSalesItem, salesItem);
        salesOrderItemRepository.save(salesItem);
    }

    @Override
    public void updateSalesItem(int salesItemId, UpdateSalesOrderItemDTO updateSalesItem) {
        SalesOrderItem salesOrderItem = salesOrderItemRepository.findById(salesItemId);
        if (salesOrderItem == null) {
            throw new SalesOrderItemDoesNotExistException("Đơn hàng xuất kho không tồn tại");
        }
        BeanUtils.copyProperties(updateSalesItem, salesOrderItem);
        salesOrderItemRepository.save(salesOrderItem);
    }

    @Override
    @Transactional
    public void delete(int id) {
        SalesOrderItem salesItem = salesOrderItemRepository.findById(id);
        if (salesItem == null) {
            throw new SalesOrderItemDoesNotExistException("Đơn hàng bán không tồn tại");
        }
        // get list of ExportItemDetail records
        List<ExportItemDetail> expItems = expItemRepository.findBySalesOrderItemId(id);
        for (ExportItemDetail expItem : expItems) {
            int grnItemId = expItem.getGrnItem().getId();
            // return quantityTake back to grnItem's quantityRemain field
            grnItemRepository.updateQuantityRemain(expItem.getQuantityTake(), grnItemId);
        }
        expItemRepository.deleteAll(expItems);
        salesOrderItemRepository.delete(salesItem);
    }

    @Override
    public SalesOrderItem getDetails(int id) {
        return salesOrderItemRepository.findById(id);
    }
}

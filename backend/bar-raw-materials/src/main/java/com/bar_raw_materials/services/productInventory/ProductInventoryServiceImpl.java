package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.dto.productInventory.*;
import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import com.bar_raw_materials.repositories.BusinessPeriodRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductInventoryServiceImpl implements ProductInventoryService {
    private final ProductInventoryRepository productInventoryRepository;
    private final BusinessPeriodRepository businessPeriodRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<ProductInventoryDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("importAmount").descending());
        BusinessPeriod businessPeriod = businessPeriodRepository.getCurrent();
        return productInventoryRepository.pagination(pageable, businessPeriod.getId());
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }
    @Override
    public List<ProductInventory> getAllByProductIds(List<Integer> productIds) {
        return productInventoryRepository.findAllByProductIds(productIds);
    }

    @Override
    public Page<VatDTO> getAllVats(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productInventoryRepository.findAllVat(pageable);
    }

    @Override
    public VATOverallDTO getVatOverall() {
        return productInventoryRepository.findVatOverall();
    }

    @Override
    public void createProductInventory(Product product) {
        // get current business beriod
        BusinessPeriod businessPeriod = businessPeriodRepository.getCurrent();
        ProductInventory productInventory = new ProductInventory(
                product,
                businessPeriod
        );
        productInventoryRepository.save(productInventory);
    }

    @Override
    public List<CurrentInventoryDTO> getCurrentInventoryByLimit(int limit) {
        return productInventoryRepository.getTopInventory(limit);
    }

    @Override
    public BigDecimal getRemainsInventory(List<Integer> ids) {
        return productInventoryRepository.getRemainsInventory(ids);
    }

    @Override
    public List<ExportQuantityDTO> getExportQuantityByLimit(int limit, Boolean DESC) {
        if (DESC) return productInventoryRepository.getTopExportQuantity(limit);
        return productInventoryRepository.getBottomExportQuantity(limit);
    }

    @Override
    @Transactional
    public void updateProductInventories(List<ProductInventory> productInventories) {
        productInventoryRepository.saveAll(productInventories);
    }
}

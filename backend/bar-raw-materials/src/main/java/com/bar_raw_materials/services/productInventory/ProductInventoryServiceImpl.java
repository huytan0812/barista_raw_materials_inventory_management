package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.dto.productInventory.ProductInventoryDTO;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductInventoryServiceImpl implements ProductInventoryService {
    private final ProductInventoryRepository productInventoryRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<ProductInventoryDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("importAmount").descending());
        return productInventoryRepository.pagination(pageable);
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
    @Transactional
    public void updateProductInventories(List<ProductInventory> productInventories) {
        productInventoryRepository.saveAll(productInventories);
    }
}

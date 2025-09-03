package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.dto.productInventory.ProductInventoryDTO;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
        Pageable pageable = PageRequest.of(page, size);
        return productInventoryRepository.pagination(pageable);
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }
}

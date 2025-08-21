package com.bar_raw_materials.services.product;

import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public List<ProductDTO> getAll() {
//        return productRepository.findAllOrderByProductIdAsc();
        return productRepository.findAllAlongCategoryAndBaseUnit();
    }

    @Override
    public Product getDetails(int id) {
        return productRepository.findById(id);
    }
}

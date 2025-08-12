package com.bar_raw_materials.services.product;

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
    public List<Product> getProducts() {
        return productRepository.findAll();
    }
}

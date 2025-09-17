package com.bar_raw_materials.services.product;

import com.bar_raw_materials.dto.product.CreateProductDTO;
import com.bar_raw_materials.dto.product.LightProductDTO;
import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.entities.BaseUnit;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.repositories.BaseUnitRepository;
import com.bar_raw_materials.repositories.CategoryRepository;
import com.bar_raw_materials.repositories.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BaseUnitRepository baseUnitRepository;

    @Override
    public List<ProductDTO> getAll() {
        return productRepository.findAllAlongCategoryAndBaseUnit();
    }

    @Override
    public List<LightProductDTO> getAllLight() {
        return productRepository.findAllLight();
    }

    @Override
    public Page<ProductDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.pagination(pageable);
    }

    @Override
    public Product getDetails(int id) {
        return productRepository.findById(id);
    }

    @Override
    @Transactional
    public void saveProduct(CreateProductDTO createProductDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(createProductDTO, product);

        int baseUnitId = createProductDTO.getBaseUnitId();
        BaseUnit baseUnit = baseUnitRepository.findBaseUnitById(baseUnitId);
        product.setBaseUnit(baseUnit);

        int categoryId = createProductDTO.getCategoryId();
        Category category = categoryRepository.findById(categoryId);
        product.setCategory(category);

        productRepository.save(product);
    }

    @Override
    public void updateProduct(Product product, CreateProductDTO createProductDTO) {
        BeanUtils.copyProperties(createProductDTO, product);

        int initBaseUnitId = product.getBaseUnit().getId();
        int updateBaseUnitId = createProductDTO.getBaseUnitId();
        int initCategoryId = product.getCategory().getId();
        int updateCategoryId = createProductDTO.getCategoryId();

        if (initBaseUnitId != updateBaseUnitId) {
            BaseUnit baseUnit = baseUnitRepository.findBaseUnitById(updateBaseUnitId);
            product.setBaseUnit(baseUnit);
        }

        if (initCategoryId != updateCategoryId) {
            Category category = categoryRepository.findById(updateCategoryId);
            product.setCategory(category);
        }

        productRepository.save(product);
    }

    @Override
    public void deleteProduct(int id) {
        productRepository.deleteById((long) id);
    }

    @Override
    public Boolean isDuplicateSKU(CreateProductDTO createProductDTO) {
        String SKU = createProductDTO.getSku();
        return productRepository.findBySku(SKU) != null;
    }
}

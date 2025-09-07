package com.bar_raw_materials.services.product;

import com.bar_raw_materials.dto.product.CreateProductDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService extends EntityService {
    List<ProductDTO> getAll();
    Product getDetails(int id);

    Page<ProductDTO> getPage(int page, int size);
    void saveProduct(CreateProductDTO createProductDTO);
    void updateProduct(Product initProduct, CreateProductDTO createProductDTO);

    Boolean isDuplicateSKU(CreateProductDTO createProductDTO);
}

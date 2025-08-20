package com.bar_raw_materials.services.product;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.EntityService;

import java.util.List;

public interface ProductService extends EntityService {
    List<Product> getAll();
    Product getDetails(int id);
}

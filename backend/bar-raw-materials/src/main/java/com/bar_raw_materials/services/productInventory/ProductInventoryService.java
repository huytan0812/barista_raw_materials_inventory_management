package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.ProductInventory;

import java.util.List;

public interface ProductInventoryService extends EntityService {
    List<ProductInventory> getAllByProductIds(List<Integer> productIds);
    void updateProductInventories(List<ProductInventory> productInventories);
}

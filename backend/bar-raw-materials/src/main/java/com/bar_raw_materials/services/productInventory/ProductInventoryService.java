package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.dto.productInventory.VATOverallDTO;
import com.bar_raw_materials.dto.productInventory.VatDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.ProductInventory;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductInventoryService extends EntityService {
    List<ProductInventory> getAllByProductIds(List<Integer> productIds);
    Page<VatDTO> getAllVats(int page, int size);
    VATOverallDTO getVatOverall();
    void createProductInventory(Product product);
    void updateProductInventories(List<ProductInventory> productInventories);
}

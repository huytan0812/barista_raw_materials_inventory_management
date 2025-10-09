package com.bar_raw_materials.services.productInventory;

import com.bar_raw_materials.dto.productInventory.CurrentInventoryDTO;
import com.bar_raw_materials.dto.productInventory.ExportQuantityDTO;
import com.bar_raw_materials.dto.productInventory.VATOverallDTO;
import com.bar_raw_materials.dto.productInventory.VatDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.ProductInventory;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface ProductInventoryService extends EntityService {
    List<ProductInventory> getAllByProductIds(List<Integer> productIds);
    Page<VatDTO> getAllVats(int page, int size);
    VATOverallDTO getVatOverall();
    List<CurrentInventoryDTO> getCurrentInventoryByLimit(int limit);
    BigDecimal getRemainsInventory(List<Integer> ids);
    List<ExportQuantityDTO> getExportQuantityByLimit(int limit, Boolean DESC);
    void createProductInventory(Product product);
    void updateProductInventories(List<ProductInventory> productInventories);
}

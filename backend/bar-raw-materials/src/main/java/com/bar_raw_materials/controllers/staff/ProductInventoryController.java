package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.productInventory.VATOverallDTO;
import com.bar_raw_materials.dto.productInventory.VatDTO;
import com.bar_raw_materials.services.productInventory.ProductInventoryService;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiStaff}/productInventory")
public class ProductInventoryController extends BaseStaffController{
    ProductInventoryService productInventoryService;

    @Autowired
    public ProductInventoryController(ProductInventoryService productInventoryService) {
        super(productInventoryService);
        this.productInventoryService = productInventoryService;
    }

    @GetMapping("allProductVAT")
    public ResponseEntity<Page<VatDTO>> allProductVAT(
            @Nullable @RequestParam(defaultValue = "0", name="page") Integer page,
            @Nullable @RequestParam(defaultValue = "5", name="size") Integer size
    ) {
        Page<VatDTO> responseData = productInventoryService.getAllVats(page, size);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("vatOverall")
    public ResponseEntity<VATOverallDTO> getVatOverall() {
        VATOverallDTO responseData = productInventoryService.getVatOverall();
        return ResponseEntity.ok(responseData);
    }
}

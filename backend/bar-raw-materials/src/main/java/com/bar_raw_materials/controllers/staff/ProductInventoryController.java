package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.productInventory.ProductInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
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
}

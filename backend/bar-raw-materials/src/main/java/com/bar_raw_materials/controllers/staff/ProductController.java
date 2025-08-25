package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.product.CreateProductDTO;
import com.bar_raw_materials.services.product.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.product.ProductService;

@RestController
@RequestMapping("${apiStaff}/product")
public class ProductController extends BaseStaffController {
    ProductService productService;

    // why put @autowired here or without @autowired, everything will run well
    @Autowired
    public ProductController(ProductService productService) {
        super(productService);
        this.productService = productService;
    }

    @PostMapping("add")
    public void add(@RequestBody CreateProductDTO createProductDTO) {
        System.out.println("SKU: " + createProductDTO.getSku());
        System.out.println("Name: " + createProductDTO.getName());
        System.out.println("Description: " + createProductDTO.getDescription());
    }
}

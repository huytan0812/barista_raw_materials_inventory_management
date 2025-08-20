package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.product.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.product.ProductService;

import java.util.ArrayList;
import java.util.List;

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
}

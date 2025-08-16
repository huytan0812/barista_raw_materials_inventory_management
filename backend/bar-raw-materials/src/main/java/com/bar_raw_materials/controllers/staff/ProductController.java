package com.bar_raw_materials.controllers.staff;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.product.ProductService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${apiStaff}/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("products")
    public List<Product> getProducts() {
        return productService.getProducts();
    }
}

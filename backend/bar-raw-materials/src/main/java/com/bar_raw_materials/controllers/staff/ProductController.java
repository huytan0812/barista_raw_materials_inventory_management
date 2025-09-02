package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.product.CreateProductDTO;
import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.utils.ImageUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.product.ProductService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${apiStaff}/product")
public class ProductController extends BaseStaffController {
    ProductService productService;
    ImageUtils imageUtils;

    // why put @autowired here or without @autowired, everything will run well
    @Autowired
    public ProductController(ProductService productService,
                             ImageUtils imageUtils
    ) {
        super(productService);
        this.productService = productService;
        this.imageUtils = imageUtils;
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, String>> add(@RequestPart("data") CreateProductDTO createProductDTO,
                              @RequestPart("image") MultipartFile image) {
        if (productService.isDuplicateSKU(createProductDTO)) {
            HttpStatus badRequest = HttpStatus.BAD_REQUEST;
            Map<String, String> responseData = new HashMap<>();
            responseData.put("errorMsg", "SKU không được phép trùng");
            return new ResponseEntity<>(responseData, badRequest);
        }

        String imageName = imageUtils.upload(image, "product");
        createProductDTO.setImageName(imageName);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("productName", createProductDTO.getName());
        responseData.put("message", "Sản phẩm " + createProductDTO.getName() + " được thêm thành công");

        productService.saveProduct(createProductDTO);
        return ResponseEntity.ok(responseData);
    }
}

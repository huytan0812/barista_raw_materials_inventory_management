package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.product.CreateProductDTO;
import com.bar_raw_materials.dto.product.LightProductDTO;
import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.utils.ImageUtils;

import org.springframework.lang.Nullable;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("allLight")
    public List<LightProductDTO> getAllLight() {
        return productService.getAllLight();
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

    @GetMapping("update/{id}")
    public ResponseEntity<CreateProductDTO> update(
            @PathVariable("id") Integer id
    ) {
        Product product = productService.getDetails(id);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        CreateProductDTO createProductDTO = new CreateProductDTO();
        BeanUtils.copyProperties(product, createProductDTO);

        return ResponseEntity.ok(createProductDTO);
    }

    @PostMapping("update/{id}")
    public ResponseEntity<Map<String, String>> update(
            @PathVariable("id") Integer id,
            @RequestPart("data") CreateProductDTO createProductDTO,
            @Nullable @RequestPart("image") MultipartFile image
    ) {
        Product product = productService.getDetails(id);
        Map<String, String> responseData = new HashMap<>();

        // check for product
        if (product == null) {
            responseData.put("errorMsg", "Không tìm thấy sản phẩm");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        if (image != null) {
            System.out.println("Image has been updated");
            // processing image
            String imageName = imageUtils.upload(image, "product");
            createProductDTO.setImageName(imageName);
        }

        // check for duplicate sku
        if (!product.getSku().equals(createProductDTO.getSku())) {
            if (productService.isDuplicateSKU(createProductDTO)) {
                responseData.put("errorMsg", "SKU không được phép trùng");
                return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
            }
        }

        productService.updateProduct(product, createProductDTO);
        responseData.put("successfulMsg", "Sản phẩm được cập nhật thành công");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable("id") Integer id
    )
    {
        Map<String, String> responseData = new HashMap<>();
        Product product = productService.getDetails(id);
        if (product == null) {
            responseData.put("errorMsg", "Sản phẩm không tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        productService.deleteProduct(id);
        responseData.put("successfulMsg", "Sản phẩm " + product.getName() + " đã được xóa thành công");
        return ResponseEntity.ok(responseData);
    }
}

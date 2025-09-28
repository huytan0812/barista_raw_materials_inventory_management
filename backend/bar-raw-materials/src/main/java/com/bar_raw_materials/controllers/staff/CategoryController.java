package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.dto.category.CreateCategoryDTO;
import com.bar_raw_materials.dto.category.LightCategoryDTO;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.services.category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${apiStaff}/category")
public class CategoryController extends BaseStaffController {
//    private CategoryService categoryService;
    CategoryService categoryService;

    // Constructor injection
    @Autowired
    public CategoryController(CategoryService categoryService) {
        super(categoryService);
        this.categoryService = categoryService;
    }

    @GetMapping("allLight")
    public List<LightCategoryDTO> getAllLight() {
        return categoryService.getAllLight();
    }

    @PostMapping("add")
    public ResponseEntity<String> addCategory(
            @RequestPart("data") CreateCategoryDTO createCategoryDTO
    ) {
        categoryService.addCategory(createCategoryDTO);
        return ResponseEntity.ok("Danh mục sản phẩm được tạo thành công");
    }
}

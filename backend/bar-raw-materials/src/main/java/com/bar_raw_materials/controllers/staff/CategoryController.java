package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.category.LightCategoryDTO;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.services.category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

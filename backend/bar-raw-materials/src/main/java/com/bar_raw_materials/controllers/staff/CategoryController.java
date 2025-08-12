package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.services.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("categories")
    public List<Category> getCategories() {
        return categoryService.getCategories();
    }
}

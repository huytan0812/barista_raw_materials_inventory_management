package com.bar_raw_materials.services.category;

import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOs = new ArrayList<>();

        for (Category category : categories) {
            categoryDTOs.add(
                    new CategoryDTO(
                            category.getId(),
                            category.getName(),
                            category.getDescription(),
                            category.getImageName(),
                            category.getParent() != null ? category.getParent().getName() : "Root"
                    )
            );
        }

        return categoryDTOs;
    };

    @Override
    public Category getDetails(int id) {
        return categoryRepository.findById(id);
    }


}

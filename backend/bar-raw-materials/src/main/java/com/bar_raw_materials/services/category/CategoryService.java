package com.bar_raw_materials.services.category;

import java.util.List;

import com.bar_raw_materials.dto.category.CreateCategoryDTO;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.dto.category.LightCategoryDTO;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

public interface CategoryService extends EntityService {
    List<CategoryDTO> getAll();
    List<LightCategoryDTO> getAllLight();
    Page<CategoryDTO> getPage(int page, int size);
    Category getDetails(int id);
    void addCategory(CreateCategoryDTO createCategoryDTO);
}

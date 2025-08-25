package com.bar_raw_materials.services.category;

import java.util.List;
import java.util.HashMap;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.services.EntityService;

public interface CategoryService extends EntityService {
    List<CategoryDTO> getAll();
    Category getDetails(int id);
}

package com.bar_raw_materials.services.category;

import java.util.List;
import java.util.HashMap;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

public interface CategoryService extends EntityService {
    List<CategoryDTO> getAll();
    Page<CategoryDTO> getPage(int page, int size);
    Category getDetails(int id);
}

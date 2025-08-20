package com.bar_raw_materials.services.category;

import java.util.List;
import com.bar_raw_materials.entities.Category;
import com.bar_raw_materials.services.EntityService;

public interface CategoryService extends EntityService {
    List<Category> getAll();
    Category getDetails(int id);
}

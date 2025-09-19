package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.category.CategoryDTO;
import com.bar_raw_materials.dto.category.LightCategoryDTO;
import com.bar_raw_materials.entities.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByOrderByNameAsc();

    @Query(
            value="SELECT new com.bar_raw_materials.dto.category.CategoryDTO" +
                    "(" +
                    "c.id, c.name, c.description, c.imageName, c.parent.name AS parentName" +
                    ") FROM Category c LEFT JOIN c.parent"
    )
    Page<CategoryDTO> pagination(Pageable pageable);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.category.LightCategoryDTO(" +
                    "c.id, c.name" +
                    ") FROM Category c LEFT JOIN c.parent"
    )
    List<LightCategoryDTO> findAllLightCategoryDTO();


    Category findById(int id);
}

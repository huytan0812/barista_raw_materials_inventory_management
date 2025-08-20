package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByOrderByNameAsc();
    Category findById(int id);
}

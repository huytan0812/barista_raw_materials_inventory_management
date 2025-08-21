package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.dto.product.ProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(
            value="SELECT p FROM Product p JOIN FETCH p.baseUnit JOIN FETCH p.category" +
                    " ORDER BY p.id ASC"
    )
    List<Product> findAllOrderByProductIdAsc();

    @Query(
            value="SELECT p FROM Product p JOIN FETCH p.baseUnit JOIN FETCH p.category " +
                    "WHERE p.id=:id"
    )
    Product findById(int id);

    @Query(
            value="SELECT " +
                    "new com.bar_raw_materials.dto.product.ProductDTO(" +
                    "p.id as productId, p.sku, p.name, p.baseUnit.notation as unit," +
                    "p.packSize, p.description, p.imageName, p.category.name as categoryName, " +
                    "p.minQuantity, p.maxQuantity, p.listPrice )" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category"
    )
    List<ProductDTO> findAllAlongCategoryAndBaseUnit();
}

package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.dto.product.ProductDTO;
import com.bar_raw_materials.dto.product.LightProductDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            value="SELECT p FROM Product p"
    )
    List<Product> findAllWithoutRelatedEntities();

    @Query(
            value="SELECT new com.bar_raw_materials.dto.product.LightProductDTO(" +
                    "p.id, p.name, p.listPrice)" + " FROM Product p "
    )
    List<LightProductDTO> findAllLight();

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
                    "p.minQuantity, p.maxQuantity, p.listPrice)" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category"
    )
    List<ProductDTO> findAllAlongCategoryAndBaseUnit();

    @Query(
            value="SELECT " +
                    "new com.bar_raw_materials.dto.product.ProductDTO(" +
                    "p.id as productId, p.sku, p.name, p.baseUnit.notation as unit," +
                    "p.packSize, p.description, p.imageName, p.category.name as categoryName, " +
                    "p.minQuantity, p.maxQuantity, p.listPrice)" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category"
    )
    Page<ProductDTO> pagination(Pageable pageable);

    Product findBySku(String sku);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.product.ProductDTO(" +
                    "p.id as productId, p.sku, p.name, p.baseUnit.notation as unit," +
                    "p.packSize, p.description, p.imageName, p.category.name as categoryName, " +
                    "p.minQuantity, p.maxQuantity, p.listPrice)" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category " +
                    "WHERE p.name LIKE %:productName% "
    )
    Page<ProductDTO> searchByProductName(String productName, Pageable pageable);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.product.ProductDTO(" +
                    "p.id as productId, p.sku, p.name, p.baseUnit.notation as unit," +
                    "p.packSize, p.description, p.imageName, p.category.name as categoryName, " +
                    "p.minQuantity, p.maxQuantity, p.listPrice)" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category " +
                    "WHERE p.category.name LIKE %:ctgName%"
    )
    Page<ProductDTO> filterByCategoryName(String ctgName, Pageable pageable);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.product.ProductDTO(" +
                    "p.id as productId, p.sku, p.name, p.baseUnit.notation as unit," +
                    "p.packSize, p.description, p.imageName, p.category.name as categoryName, " +
                    "p.minQuantity, p.maxQuantity, p.listPrice)" +
                    " FROM Product p JOIN p.baseUnit JOIN p.category " +
                    "WHERE p.name LIKE %:productName% AND p.category.name LIKE %:ctgName%"
    )
    Page<ProductDTO> searchAndFilter(String productName, String ctgName, Pageable pageable);
}

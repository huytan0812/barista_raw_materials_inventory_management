package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.dto.productInventory.ProductInventoryDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.ProductInventoryDTO(" +
                    "p.id, p.product.name AS productName, p.businessPeriod.label AS periodLabel" +
                    ", p.startingQuantity, p.startingInventory, p.importQuantity, p.importAmount" +
                    ", p.exportQuantity, p.cogs" +
                    ") FROM ProductInventory p JOIN p.product JOIN p.businessPeriod"
    )
    Page<ProductInventoryDTO> pagination(Pageable pageable);

    @Query(
            value="SELECT p FROM ProductInventory p" +
                    " JOIN FETCH p.product JOIN FETCH p.businessPeriod" +
                    " WHERE p.product.id IN :productIds"
    )
    List<ProductInventory> findAllByProductIds(List<Integer> productIds);
}

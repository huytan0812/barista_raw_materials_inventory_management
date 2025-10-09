package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.productInventory.*;
import com.bar_raw_materials.entities.ProductInventory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.ProductInventoryDTO(" +
                    "p.id, p.product.name AS productName, p.businessPeriod.label AS periodLabel" +
                    ", p.startingQuantity, p.startingInventory, p.importQuantity, p.importAmount" +
                    ", p.exportQuantity, p.revenue, p.cogs" +
                    ") FROM ProductInventory p JOIN p.product JOIN p.businessPeriod"
    )
    Page<ProductInventoryDTO> pagination(Pageable pageable);

    @Query(
            value="SELECT p FROM ProductInventory p" +
                    " JOIN FETCH p.product JOIN FETCH p.businessPeriod" +
                    " WHERE p.product.id IN :productIds"
    )
    List<ProductInventory> findAllByProductIds(List<Integer> productIds);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.VatDTO(" +
                    "productInv.id, productInv.product.name AS productName," +
                    "productInv.inputVAT, productInv.outputVAT " +
                    ") FROM ProductInventory productInv JOIN productInv.product" +
                    " ORDER BY productInv.inputVAT DESC, productInv.outputVAT DESC"
    )
    Page<VatDTO> findAllVat(Pageable pageable);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.VATOverallDTO(" +
                    "SUM(productInv.inputVAT), SUM(productInv.outputVAT)" +
                    ") FROM ProductInventory productInv"
    )
    VATOverallDTO findVatOverall();

    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.CurrentInventoryDTO(" +
                    "p.id, p.product.name AS productName," +
                    " (p.startingInventory + p.importAmount - p.cogs) AS currentInventory" +
                    ") FROM ProductInventory p JOIN p.product" +
                    " ORDER BY (p.startingInventory + p.importAmount - p.cogs) DESC LIMIT :limit"
    )
    List<CurrentInventoryDTO> getTopInventory(int limit);

    @Query(
            value="SELECT SUM(p.startingInventory + p.importAmount - p.cogs)" +
                    " FROM ProductInventory p" +
                    " WHERE p.id NOT IN :ids"
    )
    BigDecimal getRemainsInventory(List<Integer> ids);

    // for top sellers
    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.ExportQuantityDTO(" +
                    "p.product.name AS productName," +
                    "p.exportQuantity" +
                    ") FROM ProductInventory p JOIN p.product" +
                    " ORDER BY p.exportQuantity DESC LIMIT :limit"
    )
    List<ExportQuantityDTO> getTopExportQuantity(int limit);

    // for slow sellers
    @Query(
            value="SELECT new com.bar_raw_materials.dto.productInventory.ExportQuantityDTO(" +
                    "p.product.name AS productName," +
                    "p.exportQuantity" +
                    ") FROM ProductInventory p JOIN p.product" +
                    " ORDER BY p.exportQuantity ASC LIMIT :limit"
    )
    List<ExportQuantityDTO> getBottomExportQuantity(int limit);
}

package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemForExportingDTO;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface GoodsReceiptItemRepository extends JpaRepository<GoodsReceiptItem, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO(" +
                    "grnItem.id, grnItem.product.id AS productId, grnItem.product.name AS productName," +
                    " grnItem.grn.id AS grnId, grnItem.quantityImport, grnItem.unitCost, grnItem.vatRate, " +
                    " grnItem.batch.lotNumber AS lotNumber, grnItem.batch.mfgDate AS mfgDate, " +
                    "grnItem.batch.expDate AS expDate" +
                    ") FROM GoodsReceiptItem grnItem" +
                    " JOIN grnItem.product JOIN grnItem.grn JOIN grnItem.batch" +
                    " WHERE grnItem.grn.id=:grnId"
    )
    public Page<GrnItemDTO> getPageByGrnId(Integer grnId, Pageable pageable);

    @Query(
            value="SELECT grnItem FROM GoodsReceiptItem grnItem" +
                    " JOIN FETCH grnItem.product JOIN FETCH grnItem.grn JOIN FETCH grnItem.batch" +
                    " WHERE grnItem.grn.id=:grnId"
    )
    public List<GoodsReceiptItem> getAllGrnItemsByGrnId(Integer grnId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO(" +
                    "grnItem.id, grnItem.product.id AS productId, " +
                    "grnItem.quantityImport, grnItem.unitCost, grnItem.vatRate" +
                    ") FROM GoodsReceiptItem grnItem JOIN grnItem.product JOIN grnItem.grn" +
                    " WHERE grnItem.grn.id=:grnId"
    )
    public List<LightGrnItemDTO> getLightGrnItemsByGrnId(Integer grnId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.goodsReceiptItem.GrnItemForExportingDTO(" +
                    "grnItem.id, grnItem.batch.lotNumber AS lotNumber, grnItem.product.id AS productId," +
                    " grnItem.quantityRemain, grnItem.unitCost, grnItem.batch.expDate AS expDate" +
                    ") FROM GoodsReceiptItem grnItem JOIN grnItem.product JOIN grnItem.batch" +
                    " WHERE grnItem.product.id=:productId AND grnItem.quantityRemain > 0" +
                    " AND grnItem.batch.expDate >= CURRENT_DATE"
    )
    public List<GrnItemForExportingDTO> findGrnItemForExportingByProductId(Integer productId);

    public GoodsReceiptItem findById(int id);

    @Query(
            value="DELETE FROM goods_receipt_item WHERE goods_receipt_item.grnId=:grnId"
            , nativeQuery=true
    )
    @Modifying
    public void deleteByGrnId(int grnId);

    // used for returning quantityTake back from ExportItemDetails
    @Query(
            value="UPDATE goods_receipt_item SET quantityRemain = quantityRemain + :quantityTake" +
                    " WHERE goods_receipt_item.id=:grnItemId"
            , nativeQuery=true
    )
    @Modifying
    public void updateQuantityRemain(@Param("quantityTake")  int quantityTake, @Param("grnItemId") int grnItemId);

    @Query(
            value="SELECT grnItem.quantityRemain FROM goods_receipt_item grnItem" +
                    " WHERE grnItem.id=:grnItemId"
            , nativeQuery=true
    )
    public Integer getQuantityRemainByGrnItemId(int grnItemId);

    @Query("SELECT grnItem FROM GoodsReceiptItem grnItem " +
            "JOIN FETCH grnItem.grn g " +
            "JOIN FETCH grnItem.product p " +
            "WHERE g.dateCreate >= :startOfDay " +
            "AND g.dateCreate < :endOfDay " +
            "AND p.id = :productId")
    List<GoodsReceiptItem> findAllByDateAndProductId(
            @Param("startOfDay") Instant startOfDay,
            @Param("endOfDay") Instant endOfDay,
            @Param("productId") int productId);
}

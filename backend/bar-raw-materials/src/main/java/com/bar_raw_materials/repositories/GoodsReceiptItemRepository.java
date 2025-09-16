package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
            value="SELECT grnItem.id" +
                    " FROM goods_receipt_item grnItem JOIN goods_receipt_note grn ON " +
                    "grnItem.grnId = grn.id " +
                    " WHERE grn.id=:grnId",
            nativeQuery = true
    )
    public List<Integer> getAllGrnItemIdsByGrnId(Integer grnId);

    public GoodsReceiptItem findById(int id);
}

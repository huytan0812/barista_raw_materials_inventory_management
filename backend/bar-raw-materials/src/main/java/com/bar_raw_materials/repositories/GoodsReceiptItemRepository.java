package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.GoodsReceiptItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GoodsReceiptItemRepository extends JpaRepository<GoodsReceiptItem, Integer> {
    @Query(
            value="SELECT grnItem FROM GoodsReceiptItem grnItem" +
                    " JOIN FETCH grnItem.product JOIN FETCH grnItem.grn" +
                    " WHERE grnItem.grn.id=:grnId"
    )
    public Page<GoodsReceiptItem> getPageByGrnId(Integer grnId, Pageable pageable);

    public GoodsReceiptItem findById(int id);
}

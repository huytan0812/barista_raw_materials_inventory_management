package com.bar_raw_materials.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.dto.batch.LightBatchDTO;
import com.bar_raw_materials.dto.batch.BatchDTO;

public interface BatchRepository extends JpaRepository<Batch, Integer> {
    @Query(
            value="SELECT batch FROM Batch batch JOIN FETCH batch.product" +
                    " WHERE batch.lotNumber=:lotNumber"
    )
    Batch findByLotNumber(String lotNumber);

    @Query(
            value="SELECT batch FROM Batch batch JOIN FETCH batch.product"
    )
    List<Batch> findAllAlongProduct();

    @Query(
            value="SELECT new com.bar_raw_materials.dto.batch.LightBatchDTO(" +
                    "b.id, b.lotNumber, b.product.id AS productId, b.product.name AS productName, " +
                    "b.mfgDate, b.expDate" +
                    ") FROM Batch b JOIN b.product"
    )
    List<LightBatchDTO> getAllLightBatchDTO();

    @Query(
            value="SELECT b.id, b.lotNumber, p.name AS productName, b.mfgDate, b.expDate, agg.quantityRemain, agg.currentValue FROM batch b " +
                    "JOIN (" +
                    "SELECT grnItem.batchId AS batchId, grnItem.productId AS productId, " +
                    "SUM(grnItem.quantityRemain) AS quantityRemain, SUM(grnItem.quantityRemain*grnItem.unitCost) AS currentValue " +
                    "FROM goods_receipt_item grnItem GROUP BY batchId, productId" +
                    ") AS agg ON b.id = agg.batchId " +
                    "JOIN product p ON agg.productId = p.id " +
                    "ORDER BY quantityRemain DESC"
            , nativeQuery=true
    )
    Page<BatchDTO> pagination(Pageable pageable);
}

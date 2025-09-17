package com.bar_raw_materials.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.dto.batch.LightBatchDTO;

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
                    "b.id, b.lotNumber, b.product.id AS productId, " +
                    "b.mfgDate, b.expDate" +
                    ") FROM Batch b JOIN b.product"
    )
    List<LightBatchDTO> getAllLightBatchDTO();
}

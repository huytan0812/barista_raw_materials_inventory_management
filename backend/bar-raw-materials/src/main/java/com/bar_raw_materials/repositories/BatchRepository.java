package com.bar_raw_materials.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.Batch;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

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
}

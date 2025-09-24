package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.exportItem.ExportItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExportItemDetailRepository extends JpaRepository<ExportItemDetail, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.exportItem.ExportItemDTO(" +
                    "ex.id, ex.grnItem.batch.lotNumber, ex.quantityTake, ex.unitCost, " +
                    " ex.grnItem.batch.expDate" +
                    ") FROM ExportItemDetail ex JOIN ex.orderItem JOIN ex.grnItem"
    )
    List<ExportItemDTO> findBySalesOrderId(Integer salesOrderId);
}

package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.exportItem.ExportItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExportItemDetailRepository extends JpaRepository<ExportItemDetail, Integer> {
    @Query(
            value="SELECT expItem FROM ExportItemDetail expItem" +
                    " JOIN FETCH expItem.orderItem WHERE expItem.orderItem.id=:salesOrderItemId"
    )
    List<ExportItemDetail> findBySalesOrderItemId(Integer salesOrderItemId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.exportItem.ExportItemDTO(" +
                    "expItem.id, expItem.grnItem.id AS grnItemId, " +
                    "expItem.grnItem.batch.lotNumber AS lotNumber, " +
                    " expItem.quantityTake, expItem.unitCost, expItem.grnItem.batch.expDate" +
                    ") FROM ExportItemDetail expItem JOIN expItem.orderItem" +
                    " JOIN expItem.grnItem WHERE expItem.orderItem.id=:salesOrderItemId"
    )
    List<ExportItemDTO> findExpItemDTOBySalesItemId(Integer salesOrderItemId);

    @Query(
            value="SELECT ex FROM ExportItemDetail ex" +
                    " JOIN FETCH ex.grnItem WHERE ex.id=:id"
    )
    ExportItemDetail findById(int id);
}

package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO(" +
                    "s.id, s.product.id, s.product.name AS productName, s.salesOrder.id AS salesOrderId, " +
                    "s.quantitySold, s.unitPrice, " +
                    "s.discount, s.vatRate, s.note" +
                    ") FROM SalesOrderItem s JOIN s.product JOIN s.salesOrder " +
                    "WHERE s.salesOrder.id=:salesOrderId"
    )
    Page<SalesOrderItemDTO> findBySalesOrderId(Integer salesOrderId, Pageable pageable);

    @Query(
            value="SELECT s FROM SalesOrderItem s WHERE s.id=:id"
    )
    SalesOrderItem findById(int id);

    @Query(
            value="SELECT s FROM SalesOrderItem s " +
                    "JOIN s.salesOrder WHERE s.salesOrder.id=:salesOrderId"
    )
    List<SalesOrderItem> findAllBySalesOrderId(Integer salesOrderId);
}

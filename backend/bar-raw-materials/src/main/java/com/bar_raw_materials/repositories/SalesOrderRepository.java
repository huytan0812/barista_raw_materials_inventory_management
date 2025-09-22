package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.math.BigDecimal;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrder.SalesOrderDTO(" +
                    "s.id, s.customer.name AS customerName, " +
                    "s.createdBy.username AS createdByUser, s.dateCreated, s.totalAmount" +
                    ") FROM SalesOrder s JOIN s.customer JOIN s.createdBy"
    )
    List<SalesOrderDTO> findAllSalesOrderDTO();
}

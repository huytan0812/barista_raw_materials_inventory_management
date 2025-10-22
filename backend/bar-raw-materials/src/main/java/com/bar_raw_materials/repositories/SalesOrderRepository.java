package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.math.BigDecimal;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrder.SalesOrderDTO(" +
                    "s.id, s.customer.name AS customerName, s.customer.phoneNumber AS customerPhoneNumber, " +
                    "s.createdBy.username AS createdByUser, s.dateCreated, s.totalAmount" +
                    ") FROM SalesOrder s JOIN s.customer JOIN s.createdBy"
    )
    List<SalesOrderDTO> findAllSalesOrderDTO();

    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrder.SalesOrderDTO(" +
                    "s.id, s.customer.name AS customerName, s.customer.phoneNumber AS customerPhoneNumber, " +
                    "s.createdBy.username AS createdByUser, s.dateCreated, s.totalAmount" +
                    ") FROM SalesOrder s JOIN s.customer JOIN s.createdBy" +
                    " WHERE s.businessPeriod.id=:currentBusinessPeriodId"
    )
    Page<SalesOrderDTO> findAllSalesOrderDTO(Pageable pageable, Integer currentBusinessPeriodId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrder.SalesOrderDTO(" +
                    "s.id, s.customer.name AS customerName, s.customer.phoneNumber AS customerPhoneNumber, " +
                    "s.createdBy.username AS createdByUser, s.dateCreated, s.totalAmount" +
                    ") FROM SalesOrder s JOIN s.customer JOIN s.createdBy " +
                    "WHERE s.id=:id"
    )
    SalesOrderDTO findById(int id);

    @Query(
        value="SELECT s FROM SalesOrder s WHERE s.id=:id"
    )
    SalesOrder findSalesOrderById(int id);

    @Query(
        value="SELECT s FROM SalesOrder s JOIN FETCH s.customer JOIN FETCH s.createdBy " +
                " WHERE s.id=:id"
    )
    SalesOrder findSalesOrderAlongCustomer(int id);
}

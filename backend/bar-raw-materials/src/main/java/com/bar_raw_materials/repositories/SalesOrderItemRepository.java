package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.salesOrderItem.RevenueByDayDTO;
import com.bar_raw_materials.dto.salesOrderItem.StatsCardDTO;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO(" +
                    "s.id, s.product.id, s.product.name AS productName, s.salesOrder.id AS salesOrderId, " +
                    "s.quantitySold, s.unitPrice, s.cogs, " +
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

    @Query(
            value="SELECT s FROM SalesOrderItem s " +
                    " JOIN s.salesOrder JOIN FETCH s.product WHERE s.salesOrder.id=:salesOrderId"
    )
    List<SalesOrderItem> findAllAlongProductBySalesOrderId(Integer salesOrderId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.salesOrderItem.StatsCardDTO(" +
                    "SUM(s.quantitySold*s.unitPrice), " +
                    "SUM(s.quantitySold*s.unitPrice*s.discount), " +
                    "SUM(s.cogs), COUNT(DISTINCT s.salesOrder.id)" +
                    ")" + " FROM SalesOrderItem s JOIN s.salesOrder " +
                    " WHERE s.salesOrder.dateCreated >= :startDate AND " +
                    "s.salesOrder.dateCreated <= :endDate"
    )
    StatsCardDTO getStatsCardInfo(Instant startDate, Instant endDate);

    @Query("SELECT s FROM SalesOrderItem s " +
            "JOIN FETCH s.salesOrder so " +
            "JOIN FETCH s.product p " +
            "WHERE so.dateCreated >= :startOfDay " +
            "AND so.dateCreated < :endOfDay " +
            "AND p.id = :productId")
    List<SalesOrderItem> findAllByDateAndProductId(
            @Param("startOfDay") Instant startOfDay,
            @Param("endOfDay") Instant endOfDay,
            @Param("productId") int productId);

    @Query(
            value="SELECT DATE(so.dateCreated) as daily," +
                    " SUM(si.unitPrice*si.quantitySold*(1-si.discount)) as revenue" +
                    " FROM sales_order_item si JOIN sales_order so" +
                    " ON si.salesOrderId=so.id WHERE so.dateCreated >= :startDate" +
                    " GROUP BY daily"
            ,
            nativeQuery=true
    )
    List<RevenueByDayDTO> getRevenueByDayDTO(Instant startDate);
}

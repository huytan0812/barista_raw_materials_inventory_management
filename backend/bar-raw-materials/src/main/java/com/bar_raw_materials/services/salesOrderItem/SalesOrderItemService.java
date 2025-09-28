package com.bar_raw_materials.services.salesOrderItem;

import com.bar_raw_materials.dto.salesOrderItem.CreateSalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.StatsCardDTO;
import com.bar_raw_materials.dto.salesOrderItem.UpdateSalesOrderItemDTO;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface SalesOrderItemService extends EntityService {
    Page<SalesOrderItemDTO> getPageBySalesOrderId(Integer salesOrderId, int page, int size);
    SalesOrderItemDTO create(Integer salesOrderId);
    List<SalesOrderItem> getAllAlongProductBySalesOrderId(Integer salesOrderId);
    void confirmSalesOrderItem(int salesItemId, CreateSalesOrderItemDTO createSalesItem);
    void updateSalesItem(int salesItemId, UpdateSalesOrderItemDTO updateSalesItem);
    void delete(int id);

    // services for dashboard page
    StatsCardDTO getStatsCardInfo(Instant start, Instant end);
}

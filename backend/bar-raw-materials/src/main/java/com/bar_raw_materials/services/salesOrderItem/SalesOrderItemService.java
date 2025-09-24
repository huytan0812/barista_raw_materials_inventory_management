package com.bar_raw_materials.services.salesOrderItem;

import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

public interface SalesOrderItemService extends EntityService {
    Page<SalesOrderItemDTO> getPageBySalesOrderId(Integer salesOrderId, int page, int size);
    SalesOrderItemDTO create(Integer salesOrderId);
    void delete(int id);
}

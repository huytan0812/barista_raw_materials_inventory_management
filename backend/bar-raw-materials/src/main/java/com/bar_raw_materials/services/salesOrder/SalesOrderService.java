package com.bar_raw_materials.services.salesOrder;

import com.bar_raw_materials.dto.salesOrder.CreateSalesOrderDTO;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.services.EntityService;

public interface SalesOrderService extends EntityService {
    SalesOrder addSalesOrder(CreateSalesOrderDTO createSalesOrderDTO);
    SalesOrder getSalesOrder(int id);
    void deleteSalesOrder(int id);
    void confirmSalesOrder(int id);
}

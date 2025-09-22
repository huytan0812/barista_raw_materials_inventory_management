package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiStaff}/salesOrderItem")
public class SalesOrderItemController extends BaseStaffController{
    SalesOrderItemService salesOrderItemService;

    @Autowired
    public SalesOrderItemController(SalesOrderItemService salesOrderItemService) {
        super(salesOrderItemService);
        this.salesOrderItemService = salesOrderItemService;
    }
}

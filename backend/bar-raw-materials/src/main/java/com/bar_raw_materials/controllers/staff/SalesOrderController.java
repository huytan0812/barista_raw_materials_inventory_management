package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.salesOrder.CreateSalesOrderDTO;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.entities.SalesOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.services.salesOrder.SalesOrderService;

@RestController
@RequestMapping("${apiStaff}/salesOrder")
public class SalesOrderController extends BaseStaffController{
    SalesOrderService salesOrderService;

    @Autowired
    public SalesOrderController(SalesOrderService salesOrderService) {
        super(salesOrderService);
        this.salesOrderService = salesOrderService;
    }

    @PostMapping("add")
    public ResponseEntity<SalesOrderDTO> add(
            @RequestPart("data")CreateSalesOrderDTO createSalesOrderDTO
    ) {
        SalesOrderDTO salesOrderDTO = new SalesOrderDTO();
        SalesOrder salesOrder = salesOrderService.addSalesOrder(createSalesOrderDTO);
        salesOrderDTO.setId(salesOrder.getId());
        salesOrderDTO.setCustomerName(salesOrder.getCustomer().getName());
        salesOrderDTO.setCreatedByUser(salesOrder.getCreatedBy().getUsername());
        salesOrderDTO.setDateCreated(salesOrder.getDateCreated());
        salesOrderDTO.setTotalAmount(salesOrder.getTotalAmount());
        return ResponseEntity.ok(salesOrderDTO);
    }
}

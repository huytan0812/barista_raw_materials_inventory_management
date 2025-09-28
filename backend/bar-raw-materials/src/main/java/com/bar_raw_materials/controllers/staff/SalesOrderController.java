package com.bar_raw_materials.controllers.staff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.dto.salesOrder.CreateSalesOrderDTO;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.services.salesOrder.SalesOrderService;
import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.services.exportFile.SalesOrderPDFService;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("${apiStaff}/salesOrder")
public class SalesOrderController extends BaseStaffController{
    SalesOrderService salesOrderService;
    SalesOrderItemService salesItemService;
    SalesOrderPDFService salesOrderPDFService;

    @Autowired
    public SalesOrderController(
            SalesOrderService salesOrderService,
            SalesOrderItemService salesItemService,
            SalesOrderPDFService salesOrderPDFService
    ) {
        super(salesOrderService);
        this.salesOrderService = salesOrderService;
        this.salesItemService = salesItemService;
        this.salesOrderPDFService = salesOrderPDFService;
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

    @GetMapping("confirm/{id}")
    public ResponseEntity<String> confirm(
        @PathVariable("id") Integer id
    ) {
        salesOrderService.confirmSalesOrder(id);
        return ResponseEntity.ok("Duyệt phiếu xuất thành công");
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        salesOrderService.deleteSalesOrder(id);
        return ResponseEntity.ok("Hủy thành công phiếu xuất kho " + id);
    }

    @GetMapping("/export-sales-order-pdf/{id}")
    public ResponseEntity<byte[]> exportSalesOrderToPdf(
            @PathVariable("id") Integer id
    ) {
        SalesOrder salesOrder = salesOrderService.getSalesOrderAlongCustomer(id);
        List<SalesOrderItem> items = salesItemService.getAllAlongProductBySalesOrderId(id);

        ByteArrayInputStream bis = salesOrderPDFService.exportSalesOrderToPdf(salesOrder, items);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=sales_order_" + id + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bis.readAllBytes());
    }

    @GetMapping("/export-sales-invoice-pdf/{id}")
    public ResponseEntity<byte[]> exportSalesInvoiceToPdf(
            @PathVariable("id") Integer id
    ) {
        SalesOrder salesOrder = salesOrderService.getSalesOrderAlongCustomer(id);
        List<SalesOrderItem> items = salesItemService.getAllAlongProductBySalesOrderId(id);

        ByteArrayInputStream bis = salesOrderPDFService.exportSalesInvoiceToPDF(salesOrder, items);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=sales_invoice_" + id + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bis.readAllBytes());
    }
}

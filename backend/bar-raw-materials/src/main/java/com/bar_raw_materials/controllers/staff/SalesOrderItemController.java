package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${apiStaff}/salesOrderItem")
public class SalesOrderItemController extends BaseStaffController{
    SalesOrderItemService salesOrderItemService;

    @Autowired
    public SalesOrderItemController(SalesOrderItemService salesOrderItemService) {
        super(salesOrderItemService);
        this.salesOrderItemService = salesOrderItemService;
    }

    @GetMapping("/salesOrder/{salesOrderId}/salesItems")
    public ResponseEntity<Page<SalesOrderItemDTO>> getSalesOrderItem(
           @PathVariable("salesOrderId") Integer salesOrderId,
           @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
           @Nullable @RequestParam(defaultValue="5", name="size") Integer size
    ) {
        Page<SalesOrderItemDTO> responseData = salesOrderItemService.getPageBySalesOrderId(
                salesOrderId, page, size
        );
       return ResponseEntity.ok(responseData);
    }

    @GetMapping("/salesOrder/{salesOrderId}/createSaleItem")
    public ResponseEntity<SalesOrderItemDTO> createSalesOrderItem(
            @PathVariable("salesOrderId") Integer salesOrderId
    ) {
        SalesOrderItemDTO salesOrderItemDTO = salesOrderItemService.create(salesOrderId);
        return ResponseEntity.ok(salesOrderItemDTO);
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        salesOrderItemService.delete(id);
        return ResponseEntity.ok("Đơn hàng bán được xóa thành công");
    }
}

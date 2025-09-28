package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.date.StartAndEndDateDTO;
import com.bar_raw_materials.dto.salesOrderItem.CreateSalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.SalesOrderItemDTO;
import com.bar_raw_materials.dto.salesOrderItem.StatsCardDTO;
import com.bar_raw_materials.dto.salesOrderItem.UpdateSalesOrderItemDTO;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.time.*;

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

    @PostMapping("/confirmSaleItem/{salesItemId}")
    public ResponseEntity<String> confirmSalesOrderItem(
            @PathVariable("salesItemId") Integer salesItemId,
            @RequestPart("data") CreateSalesOrderItemDTO createSalesItem
            ) {
        salesOrderItemService.confirmSalesOrderItem(salesItemId, createSalesItem);
        return ResponseEntity.ok("Xác nhận đơn hàng bán thành công");
    }

    @PostMapping("update/{id}")
    public ResponseEntity<String> updateSalesOrderItem(
            @PathVariable("id") Integer id,
            @RequestPart("data") UpdateSalesOrderItemDTO updateSalesItem
    ) {
        salesOrderItemService.updateSalesItem(id, updateSalesItem);
        return ResponseEntity.ok("Đơn hàng bán được cập nhật thành công");
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        salesOrderItemService.delete(id);
        return ResponseEntity.ok("Đơn hàng bán được xóa thành công");
    }

    @PostMapping("filterRevenue")
    public ResponseEntity<StatsCardDTO> filterRevenueByDate(
            @RequestBody StartAndEndDateDTO datesDTO
    ) {
        LocalDate startDate = datesDTO.getStartDate();
        LocalDate endDate = datesDTO.getEndDate();
        Instant startDateIns = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endDateIns = endDate.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant();
        StatsCardDTO responseData = salesOrderItemService.getStatsCardInfo(
                startDateIns, endDateIns
        );

        return ResponseEntity.ok(responseData);
    }
}

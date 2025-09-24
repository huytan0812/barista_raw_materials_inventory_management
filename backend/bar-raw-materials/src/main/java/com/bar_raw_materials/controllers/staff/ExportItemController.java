package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.exportItem.CreateExportItemDTO;
import com.bar_raw_materials.dto.exportItem.ExportItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import com.bar_raw_materials.services.exportItem.ExportItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${apiStaff}/exportItem")
public class ExportItemController extends BaseStaffController{
    ExportItemService exportItemService;
    @Autowired
    public ExportItemController(ExportItemService exportItemService) {
        super(exportItemService);
        this.exportItemService = exportItemService;
    }

    @PostMapping("add")
    public ResponseEntity<ExportItemDTO> add(
            @Valid @RequestBody CreateExportItemDTO createExportItemDTO
    ) {
        ExportItemDetail exportItemDetail = exportItemService.create(createExportItemDTO);
        ExportItemDTO exportItemDTO = new ExportItemDTO();
        exportItemDTO.setId(exportItemDetail.getId());
        exportItemDTO.setLotNumber(exportItemDetail.getLotNumber());
        exportItemDTO.setQuantityTake(exportItemDetail.getQuantityTake());
        exportItemDTO.setUnitCost(exportItemDetail.getUnitCost());
        exportItemDTO.setExpDate(exportItemDetail.getGrnItem().getBatch().getExpDate());
        return ResponseEntity.ok(exportItemDTO);
    }

    @GetMapping("salesItem/{salesItemId}/list")
    public ResponseEntity<List<ExportItemDTO>> getBySalesOrderItemId(@PathVariable int salesItemId) {
        List<ExportItemDTO> responseData = exportItemService.getExportItemBySalesItemId(salesItemId);
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("update/{id}")
    public ResponseEntity<String> update(
            @PathVariable("id") Integer id,
            @RequestBody Integer quantityTake
    ) {
        exportItemService.update(id, quantityTake);
        return ResponseEntity.ok("Updated Successfully");
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        exportItemService.delete(id);
        return ResponseEntity.ok("Chi tiết hàng bán được xóa thành công");
    }
}

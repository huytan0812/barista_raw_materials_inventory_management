package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.batch.LightBatchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.services.batch.BatchService;

import java.util.List;

@RestController
@RequestMapping("${apiStaff}/batch")
public class BatchController extends BaseStaffController{
    BatchService batchService;

    @Autowired
    public BatchController(BatchService batchService) {
        super(batchService);
        this.batchService = batchService;
    }

    @GetMapping("allLight")
    public List<LightBatchDTO> getAllLight() {
        return batchService.getAllLight();
    }
}

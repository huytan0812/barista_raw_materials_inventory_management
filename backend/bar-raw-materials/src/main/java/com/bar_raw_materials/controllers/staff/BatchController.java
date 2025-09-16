package com.bar_raw_materials.controllers.staff;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.services.batch.BatchService;

@RestController
@RequestMapping("${apiStaff}/batch")
public class BatchController extends BaseStaffController{
    BatchService batchService;
    public BatchController(BatchService batchService) {
        super(batchService);
        this.batchService = batchService;
    }
}

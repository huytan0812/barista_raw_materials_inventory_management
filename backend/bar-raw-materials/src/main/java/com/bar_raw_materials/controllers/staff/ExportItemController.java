package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.exportItem.ExportItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiStaff}/exportItem")
public class ExportItemController extends BaseStaffController{
    ExportItemService exportItemService;
    @Autowired
    public ExportItemController(ExportItemService exportItemService) {
        super(exportItemService);
        this.exportItemService = exportItemService;
    }
}

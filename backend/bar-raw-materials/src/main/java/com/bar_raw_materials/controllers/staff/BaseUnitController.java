package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.baseUnit.BaseUnitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiStaff}/baseUnit")
public class BaseUnitController extends BaseStaffController{
    BaseUnitService baseUnitService;

    public BaseUnitController(BaseUnitService baseUnitService) {
        super(baseUnitService);
        this.baseUnitService = baseUnitService;
    }
}

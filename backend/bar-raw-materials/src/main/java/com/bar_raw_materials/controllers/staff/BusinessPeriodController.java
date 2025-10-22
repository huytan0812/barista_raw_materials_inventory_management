package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.services.businessPeriod.BusinessPeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("${apiStaff}/businessPeriod")
public class BusinessPeriodController extends BaseStaffController {
    BusinessPeriodService businessPeriodService;

    @Autowired
    public BusinessPeriodController(BusinessPeriodService businessPeriodService) {
        super(businessPeriodService);
        this.businessPeriodService = businessPeriodService;
    }

    @GetMapping("current")
    public ResponseEntity<BusinessPeriod> getCurrent() {
        BusinessPeriod businessPeriod = businessPeriodService.getCurrent();
        if (businessPeriod == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(businessPeriod);
    }

    @PostMapping("add")
    public ResponseEntity<String> add() {
        businessPeriodService.createPeriodWithProductInventories();
        return new ResponseEntity<>("Successfully added", HttpStatus.CREATED);
    }

    @GetMapping("endPeriod")
    public ResponseEntity<List<ProductInventory>> endPeriod() {
        businessPeriodService.endOfPeriod();
        List<ProductInventory> productINVs = businessPeriodService.getAllCurrentPeriodProductINVs();
        return ResponseEntity.ok(productINVs);
    }
}

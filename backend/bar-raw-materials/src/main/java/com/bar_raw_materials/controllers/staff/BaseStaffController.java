package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.EntityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.ArrayList;

public class BaseStaffController {
    EntityService entityService;

    public BaseStaffController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping("list")
    public List<?> getAll() {
        System.out.println("EntityService name: " + entityService.getClass().getName());
        return entityService.getAll();
    }

    @GetMapping("details/{id}")
    public <T> T getById(@PathVariable("id") Integer id) {
        return entityService.getDetails(id);
    }
}

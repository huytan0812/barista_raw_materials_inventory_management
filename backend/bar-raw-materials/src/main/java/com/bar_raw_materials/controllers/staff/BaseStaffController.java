package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.EntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

public class BaseStaffController {
    EntityService entityService;

    public BaseStaffController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping("list")
    public ResponseEntity<Page<?>> getAll(
            @Nullable @RequestParam(defaultValue="0", name="page") int page,
            @Nullable @RequestParam(defaultValue="10", name="size") int size
    ) {
        Page<?> responseData = entityService.getPage(page, size);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("details/{id}")
    public <T> T getById(@PathVariable("id") Integer id) {
        return entityService.getDetails(id);
    }
}

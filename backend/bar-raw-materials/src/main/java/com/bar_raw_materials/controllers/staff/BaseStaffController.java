package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.EntityService;
import org.springframework.http.HttpStatus;
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

    public BaseStaffController() {}

    @GetMapping("all")
    public ResponseEntity<List<?>> getAll() {
        List<?> entity = entityService.getAll();
        return ResponseEntity.ok(entity);
    }

    @GetMapping("list")
    public ResponseEntity<Page<?>> getPage(
            @Nullable @RequestParam(defaultValue="0", name="page") int page,
            @Nullable @RequestParam(defaultValue="10", name="size") int size
    ) {
        Page<?> responseData = entityService.getPage(page, size);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("details/{id}")
    public <T> ResponseEntity<T> getById(@PathVariable("id") Integer id) {
        T entity = entityService.getDetails(id);
        if (entity == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(entity);
    }
}

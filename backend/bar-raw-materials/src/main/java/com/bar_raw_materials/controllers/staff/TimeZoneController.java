package com.bar_raw_materials.controllers.staff;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("${apiStaff}/timezone")
public class TimeZoneController {
    @GetMapping("today")
    public ResponseEntity<Map<String, Instant>> today() {
        Map<String, Instant> responseData = new HashMap<>();
        LocalDate today = LocalDate.now();
        System.out.println("Today is: " + today);
        System.out.println("System default zone: " + ZoneId.systemDefault());
        System.out.println("Start of day: " + today.atStartOfDay(ZoneId.systemDefault()));
        System.out.println("End of day: " + today.plusDays(1).atStartOfDay(ZoneId.systemDefault()));
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        responseData.put("startOfDay", startOfDay);
        responseData.put("endOfDay", endOfDay);
        return ResponseEntity.ok(responseData);
    }
}

package com.bar_raw_materials.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

import com.bar_raw_materials.utils.HashingUtils;

@RestController
@RequiredArgsConstructor
public class HashPasswordController {
    private final HashingUtils hashingUtils;

    @GetMapping("/hash")
    public ResponseEntity<Map<String, String>> hashPassword(@RequestParam("password") String password) {
        Map<String, String> responseData = new HashMap<>();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        responseData.put("BCryptPasswordEncoder", passwordEncoder.encode(password));
        responseData.put("customHashPassword", hashingUtils.hash(password));
        return ResponseEntity.ok(responseData);
    }
}

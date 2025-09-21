package com.bar_raw_materials.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;
import java.util.HashMap;

import com.bar_raw_materials.exceptions.vendor.DuplicatedTaxCodeException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DuplicatedTaxCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateTaxCode(DuplicatedTaxCodeException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("duplicatedTaxCode", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
//        ex.printStackTrace();
        return ResponseEntity.badRequest().body("Có lỗi xảy ra");
    }
}

package com.bar_raw_materials.exceptions;

import com.bar_raw_materials.exceptions.customer.CustomerDoesNotExistException;
import com.bar_raw_materials.exceptions.customer.DuplicatedPhoneNumberException;
import com.bar_raw_materials.exceptions.exportItem.ExceedQuantityRemainException;
import com.bar_raw_materials.exceptions.salesOrder.SalesOrderDoesNotExistException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.rmi.MarshalledObject;
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

    @ExceptionHandler(DuplicatedPhoneNumberException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatePhoneNumber(DuplicatedPhoneNumberException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("duplicatedPhoneNumber", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomerDoesNotExistException.class)
    public ResponseEntity<Map<String, String>> handleCustomerDoesNotExist(CustomerDoesNotExistException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("customerDoesNotExist", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SalesOrderDoesNotExistException.class)
    public ResponseEntity<Map<String, String>> handleSalesOrderDoesNotExist(SalesOrderDoesNotExistException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("salesOrderDoesNotExist", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ExceedQuantityRemainException.class)
    public ResponseEntity<Map<String, String>> handleExceedQuantityRemain(ExceedQuantityRemainException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("exceedQuantityRemain", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
//        ex.printStackTrace();
        return ResponseEntity.badRequest().body("Có lỗi xảy ra");
    }
}

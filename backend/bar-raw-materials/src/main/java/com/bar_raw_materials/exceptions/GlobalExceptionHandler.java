package com.bar_raw_materials.exceptions;

import com.bar_raw_materials.exceptions.customer.CustomerDoesNotExistException;
import com.bar_raw_materials.exceptions.customer.DuplicatedPhoneNumberException;
import com.bar_raw_materials.exceptions.exportItem.ExceedQuantityRemainException;
import com.bar_raw_materials.exceptions.exportItem.ExportItemDetailDoesNotExistException;
import com.bar_raw_materials.exceptions.grnItem.GoodsReceiptItemDoesNotExistException;
import com.bar_raw_materials.exceptions.product.ProductDoesNotExistException;
import com.bar_raw_materials.exceptions.salesItem.SalesOrderItemDoesNotExistException;
import com.bar_raw_materials.exceptions.salesOrder.SalesOrderDoesNotExistException;
import com.bar_raw_materials.exceptions.user.*;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
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

    @ExceptionHandler(GoodsReceiptItemDoesNotExistException.class)
    public ResponseEntity<Map<String, String>> handleGoodsReceiptItemDoesNotExist(GoodsReceiptItemDoesNotExistException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("goodsReceiptItemDoesNotExist", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SalesOrderItemDoesNotExistException.class)
    public ResponseEntity<String> handleSalesOrderItemDoesNotExist(SalesOrderItemDoesNotExistException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ExportItemDetailDoesNotExistException.class)
    public ResponseEntity<String> handleExportItemDetailDoesNotExist(ExportItemDetailDoesNotExistException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductDoesNotExistException.class)
    public ResponseEntity<String> handleProductDoesNotExist(ProductDoesNotExistException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicatedUserPhoneNumberException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatedUserPhoneNumber(DuplicatedUserPhoneNumberException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("duplicatedUserPhoneNumber", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicatedUserEmailException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatedUserEmail(DuplicatedUserEmailException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("duplicatedUserEmail", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConfirmPasswordDifferentException.class)
    public ResponseEntity<Map<String, String>> handleConfirmPasswordDifferent(ConfirmPasswordDifferentException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("confirmPasswordDifferent", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicatedUsernameException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatedUsername(DuplicatedUsernameException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("duplicatedUsername", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordDoesNotMatchException.class)
    public ResponseEntity<String> handlePasswordDoesNotMatch(PasswordDoesNotMatchException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("Có lỗi xảy ra");
    }
}

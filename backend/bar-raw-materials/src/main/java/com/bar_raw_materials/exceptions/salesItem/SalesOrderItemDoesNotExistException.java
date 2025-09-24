package com.bar_raw_materials.exceptions.salesItem;

public class SalesOrderItemDoesNotExistException extends RuntimeException {
    public SalesOrderItemDoesNotExistException(String message) {
        super(message);
    }
}

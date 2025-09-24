package com.bar_raw_materials.exceptions.salesOrder;

public class SalesOrderDoesNotExistException extends RuntimeException {
    public SalesOrderDoesNotExistException(String msg) {
        super(msg);
    }
}

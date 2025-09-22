package com.bar_raw_materials.exceptions.customer;

public class CustomerDoesNotExistException extends RuntimeException {
    public CustomerDoesNotExistException(String msg) {
        super(msg);
    }
}

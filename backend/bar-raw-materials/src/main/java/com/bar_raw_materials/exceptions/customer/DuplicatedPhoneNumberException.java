package com.bar_raw_materials.exceptions.customer;

public class DuplicatedPhoneNumberException extends RuntimeException {
    public DuplicatedPhoneNumberException(String msg) {
        super(msg);
    }
}

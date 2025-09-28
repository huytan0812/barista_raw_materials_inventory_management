package com.bar_raw_materials.exceptions.user;

public class DuplicatedUserPhoneNumberException extends RuntimeException {
    public DuplicatedUserPhoneNumberException(String message) {
        super(message);
    }
}

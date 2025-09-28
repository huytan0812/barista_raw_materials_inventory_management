package com.bar_raw_materials.exceptions.user;

public class ConfirmPasswordDifferentException extends RuntimeException {
    public ConfirmPasswordDifferentException(String message) {
        super(message);
    }
}

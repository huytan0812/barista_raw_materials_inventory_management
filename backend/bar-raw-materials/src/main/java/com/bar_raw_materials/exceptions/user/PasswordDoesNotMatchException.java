package com.bar_raw_materials.exceptions.user;

public class PasswordDoesNotMatchException extends RuntimeException {
    public PasswordDoesNotMatchException(String msg) {
        super(msg);
    }
}

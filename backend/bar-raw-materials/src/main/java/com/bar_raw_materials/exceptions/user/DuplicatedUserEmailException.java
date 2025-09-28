package com.bar_raw_materials.exceptions.user;

public class DuplicatedUserEmailException extends RuntimeException {
    public DuplicatedUserEmailException(String message) {
        super(message);
    }
}

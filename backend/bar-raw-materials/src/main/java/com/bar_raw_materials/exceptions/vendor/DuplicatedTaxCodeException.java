package com.bar_raw_materials.exceptions.vendor;

public class DuplicatedTaxCodeException extends RuntimeException {
    public DuplicatedTaxCodeException(String message) {
        super(message);
    }
}

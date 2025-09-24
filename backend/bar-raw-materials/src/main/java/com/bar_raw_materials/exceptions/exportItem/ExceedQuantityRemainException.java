package com.bar_raw_materials.exceptions.exportItem;

public class ExceedQuantityRemainException extends RuntimeException {
    public ExceedQuantityRemainException(String message) {
        super(message);
    }
}

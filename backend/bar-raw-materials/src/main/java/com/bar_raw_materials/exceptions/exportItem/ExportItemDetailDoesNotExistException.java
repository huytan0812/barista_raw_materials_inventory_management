package com.bar_raw_materials.exceptions.exportItem;

public class ExportItemDetailDoesNotExistException extends RuntimeException {
    public ExportItemDetailDoesNotExistException(String msg) {
        super(msg);
    }
}

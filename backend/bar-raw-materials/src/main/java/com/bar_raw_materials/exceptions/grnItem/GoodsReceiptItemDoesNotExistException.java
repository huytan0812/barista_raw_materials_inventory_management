package com.bar_raw_materials.exceptions.grnItem;

public class GoodsReceiptItemDoesNotExistException extends RuntimeException {
    public GoodsReceiptItemDoesNotExistException(String message) {
        super(message);
    }
}

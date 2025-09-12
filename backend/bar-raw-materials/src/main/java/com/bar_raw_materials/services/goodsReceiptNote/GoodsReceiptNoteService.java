package com.bar_raw_materials.services.goodsReceiptNote;

import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.services.EntityService;

public interface GoodsReceiptNoteService extends EntityService {
    GoodsReceiptNote createGrn(CreateGrnDTO createGrnDTO);
    Boolean isDuplicateInvoiceNumber(String invoiceNumber);
    GoodsReceiptNote getDetails(int id);
    void update (GoodsReceiptNote grn, CreateGrnDTO createGrnDTO);
}

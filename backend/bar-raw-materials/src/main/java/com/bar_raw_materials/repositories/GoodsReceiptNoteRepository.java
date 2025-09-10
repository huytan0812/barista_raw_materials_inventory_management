package com.bar_raw_materials.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.GoodsReceiptNote;

public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Integer> {
    GoodsReceiptNote findByInvoiceNumber(String invoiceNumber);
}

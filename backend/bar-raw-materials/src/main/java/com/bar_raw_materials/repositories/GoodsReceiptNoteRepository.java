package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.goodsReceiptNote.GrnDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import org.springframework.data.jpa.repository.Query;

public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Integer> {
    GoodsReceiptNote findByInvoiceNumber(String invoiceNumber);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.goodsReceiptNote.GrnDTO(" +
                    "grn.id, grn.vendor.name AS vendorName, grn.dateCreate," +
                    " grn.createdBy.username AS createdByUser, grn.invoiceNumber, grn.invoiceDate" +
                    ", grn.isConfirmed" +
                    ")" + " FROM GoodsReceiptNote grn JOIN grn.createdBy JOIN grn.vendor" +
                    " WHERE grn.businessPeriod.id=:currentBusinessPeriodId"
    )
    Page<GrnDTO> pagination(Pageable pageable, Integer currentBusinessPeriodId);

    @Query(
            value="SELECT grn FROM GoodsReceiptNote grn JOIN FETCH grn.businessPeriod" +
                    " JOIN FETCH grn.vendor JOIN FETCH grn.createdBy WHERE grn.id=:id"
    )
    GoodsReceiptNote findById(int id);
}

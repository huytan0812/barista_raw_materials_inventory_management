package com.bar_raw_materials.services.goodsReceiptNote;

import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.dto.goodsReceiptNote.GrnDTO;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.Vendor;
import com.bar_raw_materials.repositories.GoodsReceiptNoteRepository;
import com.bar_raw_materials.repositories.VendorRepository;
import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.repositories.BusinessPeriodRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GoodsReceiptNoteServiceImpl implements GoodsReceiptNoteService {
    private final GoodsReceiptNoteRepository goodsReceiptNoteRepository;
    private final VendorRepository vendorRepository;
    private final BusinessPeriodRepository businessPeriodRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<GrnDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return goodsReceiptNoteRepository.pagination(pageable);
    }

    @Override
    public GoodsReceiptNote getDetails(int id) {
        return goodsReceiptNoteRepository.findById(id);
    }

    @Override
    public GoodsReceiptNote createGrn(CreateGrnDTO createGrnDTO) {
        GoodsReceiptNote grn = new GoodsReceiptNote();
        BeanUtils.copyProperties(createGrnDTO, grn);

        int vendorId = createGrnDTO.getVendorId();
        Vendor vendor = vendorRepository.findById(vendorId).orElse(null);
        grn.setVendor(vendor);

        BusinessPeriod bp = businessPeriodRepository.getCurrent();
        grn.setBusinessPeriod(bp);

        grn.setDateCreate(Instant.now());
        grn.setTotalAmount(BigDecimal.ZERO);

        return goodsReceiptNoteRepository.save(grn);
    }

    @Override
    public Boolean isDuplicateInvoiceNumber(String invoiceNumber) {
        return goodsReceiptNoteRepository.findByInvoiceNumber(invoiceNumber) != null;
    }

    @Override
    public void update(CreateGrnDTO createGrnDTO) {

    }
}

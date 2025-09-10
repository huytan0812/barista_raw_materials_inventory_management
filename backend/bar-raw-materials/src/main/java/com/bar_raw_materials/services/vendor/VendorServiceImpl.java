package com.bar_raw_materials.services.vendor;

import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.entities.Vendor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.bar_raw_materials.repositories.VendorRepository;
import com.bar_raw_materials.entities.GoodsReceiptNote;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {
    private final VendorRepository vendorRepository;

    @Override
    public List<?> getAll() {
        return vendorRepository.findAll();
    }

    @Override
    public Page<?> getPage(int page, int size) {
        return null;
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }
}

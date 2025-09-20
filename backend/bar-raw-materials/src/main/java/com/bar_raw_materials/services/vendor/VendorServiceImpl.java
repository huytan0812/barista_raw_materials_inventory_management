package com.bar_raw_materials.services.vendor;

import com.bar_raw_materials.dto.vendor.CreateVendorDTO;
import com.bar_raw_materials.dto.vendor.LightVendorDTO;
import com.bar_raw_materials.entities.Vendor;
import com.bar_raw_materials.repositories.VendorRepository;
import com.bar_raw_materials.exceptions.vendor.DuplicatedTaxCodeException;
import com.bar_raw_materials.utils.ImageUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {
    private final VendorRepository vendorRepository;
    private final ImageUtils imageUtils;

    @Override
    public List<Vendor> getAll() {
        return vendorRepository.findAll();
    }

    @Override
    public Page<Vendor> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return vendorRepository.findAll(pageable);
    }

    @Override
    public Vendor getDetails(int id) {
        return null;
    }

    @Override
    public List<LightVendorDTO> getAllLightVendors() {
        return vendorRepository.findAllLightVendors();
    }

    @Override
    public void createVendor(
            CreateVendorDTO createVendorDTO,
            MultipartFile businessImgFile,
            MultipartFile foodSafetyCertImgFile
    ) {
        if (isDuplicatedTaxCode(createVendorDTO.getTaxCode())) {
            throw new DuplicatedTaxCodeException("Mã số thuế đã tồn tại");
        }
        String businessLicenseImgName = imageUtils.upload(businessImgFile, "vendor");
        String foodSafetyCertImgName = imageUtils.upload(foodSafetyCertImgFile, "vendor");
        createVendorDTO.setBusinessLicenseImgName(businessLicenseImgName);
        createVendorDTO.setFoodSafetyCertImgName(foodSafetyCertImgName);

        Vendor vendor = new Vendor();
        BeanUtils.copyProperties(createVendorDTO, vendor);
        vendorRepository.save(vendor);
    }

    @Override
    public Boolean isDuplicatedTaxCode(String taxCode) {
        return vendorRepository.findByTaxCode(taxCode) != null;
    }
}

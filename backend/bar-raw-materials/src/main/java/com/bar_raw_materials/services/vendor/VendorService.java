package com.bar_raw_materials.services.vendor;

import com.bar_raw_materials.entities.Vendor;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.dto.vendor.LightVendorDTO;
import com.bar_raw_materials.dto.vendor.CreateVendorDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VendorService extends EntityService {
    List<LightVendorDTO> getAllLightVendors();
    void createVendor(
            CreateVendorDTO createVendorDTO,
            MultipartFile businessImgFile,
            MultipartFile foodSafetyCertImgFile
    );
    void updateVendor(
            Vendor vendor,
            CreateVendorDTO updateVendorDTO,
            MultipartFile businessImgFile,
            MultipartFile foodSafetyCertImgFile
    );
    void deleteVendor(Vendor vendor);
    Boolean isDuplicatedTaxCode(String taxCode);
}

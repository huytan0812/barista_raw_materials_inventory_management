package com.bar_raw_materials.services.vendor;

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
    Boolean isDuplicatedTaxCode(String taxCode);
}

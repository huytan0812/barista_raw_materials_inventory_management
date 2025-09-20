package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.vendor.LightVendorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.services.vendor.VendorService;
import com.bar_raw_materials.utils.ImageUtils;
import com.bar_raw_materials.dto.vendor.CreateVendorDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("${apiStaff}/vendor")
public class VendorController extends BaseStaffController {
    VendorService vendorService;
    ImageUtils imageUtils;

    @Autowired
    public VendorController(VendorService vendorService, ImageUtils imageUtils) {
        super(vendorService);
        this.vendorService = vendorService;
        this.imageUtils = imageUtils;
    }

    @GetMapping("allLight")
    public List<LightVendorDTO> getAllLightVendors() {
        return vendorService.getAllLightVendors();
    }

    @PostMapping("add")
    public ResponseEntity<String> add(
            @RequestPart("data") CreateVendorDTO createVendorDTO,
            @Nullable @RequestPart("businessImage") MultipartFile businessImgFile,
            @Nullable @RequestPart("foodSafetyCertImage") MultipartFile foodSafetyCertImgFile
    ) {
        vendorService.createVendor(createVendorDTO, businessImgFile, foodSafetyCertImgFile);
        return ResponseEntity.ok("Nhà cung cấp được tạo thành công");
    }
}

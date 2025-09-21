package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.vendor.LightVendorDTO;
import com.bar_raw_materials.entities.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        System.out.println("CreateVendorDTO businessImgFileName = " + createVendorDTO.getBusinessLicenseImgName());
        System.out.println("CreateVendorDTO foodImg = " + createVendorDTO.getFoodSafetyCertImgName());
        vendorService.createVendor(createVendorDTO, businessImgFile, foodSafetyCertImgFile);
        return ResponseEntity.ok("Nhà cung cấp được tạo thành công");
    }

    @PostMapping("update/{id}")
    public ResponseEntity<String> update(
            @PathVariable("id") Integer id,
            @RequestPart("data") CreateVendorDTO updateVendorDTO,
            @Nullable @RequestPart("businessImage") MultipartFile businessImgFile,
            @Nullable @RequestPart("foodSafetyCertImage") MultipartFile foodSafetyCertImgFile
    ) {
        Vendor vendor = vendorService.getDetails(id);
        if (vendor == null) {
            return new ResponseEntity<>("Nhà cung cấp không tồn tại", HttpStatus.NOT_FOUND);
        }
        System.out.println("CreateVendorDTO businessImgFileName = " + updateVendorDTO.getBusinessLicenseImgName());
        System.out.println("CreateVendorDTO foodImg = " + updateVendorDTO.getFoodSafetyCertImgName());
        updateVendorDTO.setId(id);
        vendorService.updateVendor(
                vendor,
                updateVendorDTO,
                businessImgFile,
                foodSafetyCertImgFile
        );
        return ResponseEntity.ok("Cập nhật thành công nhà cung cấp");
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        Vendor vendor = vendorService.getDetails(id);
        if (vendor == null) {
            return new ResponseEntity<>("Không tìm thấy nhà cung cấp", HttpStatus.NOT_FOUND);
        }
        vendorService.deleteVendor(vendor);
        return ResponseEntity.ok("Xóa nhà cung cấp thành công");
    }
}

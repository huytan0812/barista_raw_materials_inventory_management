package com.bar_raw_materials.controllers.staff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.bar_raw_materials.services.vendor.VendorService;
import com.bar_raw_materials.utils.ImageUtils;
import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import org.springframework.web.multipart.MultipartFile;

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
}

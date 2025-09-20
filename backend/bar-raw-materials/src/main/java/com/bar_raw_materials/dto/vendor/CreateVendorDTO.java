package com.bar_raw_materials.dto.vendor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVendorDTO {
    private Integer id;
    private String name;
    private String taxCode;
    private String phoneNumber;
    private String email;
    private String address;
    private String businessLicenseImgName;
    private String foodSafetyCertImgName;
}

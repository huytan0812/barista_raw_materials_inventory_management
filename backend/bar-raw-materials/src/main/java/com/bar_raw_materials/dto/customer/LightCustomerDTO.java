package com.bar_raw_materials.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LightCustomerDTO {
    private Integer id;
    private String name;
    private String phoneNumber;
}

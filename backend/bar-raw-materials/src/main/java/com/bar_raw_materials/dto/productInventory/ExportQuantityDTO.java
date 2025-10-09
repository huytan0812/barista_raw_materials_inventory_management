package com.bar_raw_materials.dto.productInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportQuantityDTO {
    private String productName;
    private Integer exportQuantity;
}

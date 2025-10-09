package com.bar_raw_materials.dto.productInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentInventoryDTO {
    private Integer id;
    private String productName;
    private BigDecimal currentInventory;

    public CurrentInventoryDTO(
            Integer id,
            String productName,
            Integer currentInventory
    ) {
        this.id = id;
        this.productName = productName;
        this.currentInventory = new BigDecimal(currentInventory);
    }
}

package com.bar_raw_materials.dto.productInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VatDTO {
    private Integer id;
    private String productName;
    private BigDecimal inputVAT;
    private BigDecimal outputVAT;
}

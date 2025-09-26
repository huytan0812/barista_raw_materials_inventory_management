package com.bar_raw_materials.dto.productInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportValueDTO {
    private Integer exportQuantity;
    private BigDecimal cogs;
    private BigDecimal revenue;
}

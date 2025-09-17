package com.bar_raw_materials.dto.goodsReceiptItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LightGrnItemDTO {
    private Integer id;
    private Integer productId;
    private Integer quantityImport;
    private BigDecimal unitCost;
}

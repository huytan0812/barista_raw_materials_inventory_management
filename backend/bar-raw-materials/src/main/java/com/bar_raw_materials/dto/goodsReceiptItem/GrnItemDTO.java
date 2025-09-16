package com.bar_raw_materials.dto.goodsReceiptItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnItemDTO {
    private Integer id;
    private Integer productId;
    private String productName;
    private Integer grnId;
    private Integer quantityImport;
    private BigDecimal unitCost;
    private Float vatRate;

    // these attributes for batch
    private String lotNumber;
    private LocalDate mfgDate;
    private LocalDate expDate;
}

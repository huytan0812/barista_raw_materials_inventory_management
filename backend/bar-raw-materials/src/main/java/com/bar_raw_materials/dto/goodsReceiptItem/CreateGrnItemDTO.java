package com.bar_raw_materials.dto.goodsReceiptItem;

import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGrnItemDTO {
    private Integer id;
    private Integer productId;
    private Integer grnId;
    private Integer quantityImport;
    private BigDecimal unitCost;
    private String lotNumber;
    private LocalDate mfgDate;
    private LocalDate expDate;
    private Float vatRate;
}

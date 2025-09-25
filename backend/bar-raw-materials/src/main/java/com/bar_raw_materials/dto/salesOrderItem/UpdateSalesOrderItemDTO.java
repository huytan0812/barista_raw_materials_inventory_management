package com.bar_raw_materials.dto.salesOrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSalesOrderItemDTO {
    private Integer quantitySold;
    private BigDecimal unitPrice;
    private Float discount;
    private Float vatRate;
    private String note;
}

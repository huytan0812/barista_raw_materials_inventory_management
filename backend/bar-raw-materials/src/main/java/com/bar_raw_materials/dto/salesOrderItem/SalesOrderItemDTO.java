package com.bar_raw_materials.dto.salesOrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderItemDTO {
    private Integer id;
    private Integer productId;
    private String productName;
    private Integer salesOrderId;
    private Integer quantitySold;
    private BigDecimal unitPrice;
    private BigDecimal cogs;
    private Float discount;
    private Float vatRate;
    private String note;
}

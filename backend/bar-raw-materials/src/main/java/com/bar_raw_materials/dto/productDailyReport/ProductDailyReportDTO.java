package com.bar_raw_materials.dto.productDailyReport;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDailyReportDTO {
    private Integer id;
    private String productName;
    private Integer importQuantity;
    private BigDecimal importAmount;
    private Integer exportQuantity;
    private BigDecimal cogs;
    private BigDecimal revenue;
}

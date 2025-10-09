package com.bar_raw_materials.dto.salesOrderItem;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RevenueByMonthDTO {
    private Integer monthly;
    private BigDecimal revenue;

    public RevenueByMonthDTO(Integer monthly, Double revenue) {
        this.monthly = monthly;
        this.revenue = BigDecimal.valueOf(revenue);
    }
}

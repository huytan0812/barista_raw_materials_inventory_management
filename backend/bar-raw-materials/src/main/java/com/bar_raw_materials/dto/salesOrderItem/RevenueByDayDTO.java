package com.bar_raw_materials.dto.salesOrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.sql.Date;
import java.time.Instant;

@Data
public class RevenueByDayDTO {
    private LocalDate daily;
    private BigDecimal revenue;

    public RevenueByDayDTO(Date date, Double revenue) {
        this.daily = date.toLocalDate();
        this.revenue = BigDecimal.valueOf(revenue);
    }
}

package com.bar_raw_materials.dto.salesOrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsCardDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalCogs;
    private BigDecimal grossProfit;
    private Long numberOfOrders;

    public StatsCardDTO(
            Long revenue,
            Long discount,
            BigDecimal totalCogs,
            Long numberOfOrders
    ) {
        BigDecimal castDiscount = new BigDecimal(discount);
        BigDecimal castRevenue = new BigDecimal(revenue);
        this.totalRevenue = castRevenue.subtract(castDiscount);
        this.totalCogs = totalCogs;
        this.grossProfit = totalRevenue.subtract(totalCogs);
        this.numberOfOrders = numberOfOrders;
    }
    public StatsCardDTO(
            BigDecimal revenue,
            Double discount,
            BigDecimal totalCogs,
            Long numberOfOrders
    ) {
        BigDecimal castDiscount = discount != null ? new BigDecimal(discount) : BigDecimal.ZERO;
        this.totalRevenue = revenue != null ?
                revenue.
                subtract(castDiscount).
                setScale(0, RoundingMode.CEILING) : BigDecimal.ZERO;
        this.totalCogs = totalCogs != null ? totalCogs : BigDecimal.ZERO;
        this.grossProfit = revenue != null ?
                        totalRevenue.
                        subtract(totalCogs).
                        setScale(0, RoundingMode.CEILING) : BigDecimal.ZERO;
        this.numberOfOrders = numberOfOrders != null ? numberOfOrders : 0;
    }
}

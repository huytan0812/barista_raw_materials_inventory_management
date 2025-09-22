package com.bar_raw_materials.dto.salesOrder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderDTO {
    private Integer id;
    private String customerName;
    private String createdByUser;
    private Instant dateCreated;
    private BigDecimal totalAmount;
}

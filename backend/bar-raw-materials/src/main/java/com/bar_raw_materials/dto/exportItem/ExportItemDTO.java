package com.bar_raw_materials.dto.exportItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportItemDTO {
    private Integer id;
    private String lotNumber;
    private Integer quantityTake;
    private BigDecimal importCost;
    private LocalDate expDate;
}

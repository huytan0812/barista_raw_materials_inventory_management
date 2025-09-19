package com.bar_raw_materials.dto.batch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LightBatchDTO {
    private Integer id;
    private String lotNumber;
    private Integer productId;
    private String productName;
    private LocalDate mfgDate;
    private LocalDate expDate;
}

package com.bar_raw_materials.dto.goodsReceiptNote;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnDTO {
    private Integer id;
    private String vendorName;
    private Instant dateCreate;
    private String createdByUser;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private Boolean isConfirmed;
}

package com.bar_raw_materials.dto.batch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZoneId;
import java.sql.Date;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class BatchDTO {
    private Integer id;
    private String lotNumber;
    private String productName;
    private Integer expiryWarningThreshold;
    private LocalDate mfgDate;
    private LocalDate expDate;
    private BigDecimal quantityRemain;
    private BigDecimal currentValue;

    public BatchDTO(
            Integer id,
            String lotNumber,
            String productName,
            Integer expiryWarningThreshold,
            Date mfgDate,
            Date expDate,
            BigDecimal quantityRemain,
            BigDecimal currentValue
    ) {
       this.id = id;
       this.lotNumber = lotNumber;
       this.productName = productName;
       this.expiryWarningThreshold = expiryWarningThreshold;
       this.mfgDate = mfgDate.toLocalDate();
       this.expDate = expDate.toLocalDate();
       this.quantityRemain = quantityRemain;
       this.currentValue = currentValue;
    }

//    public static LocalDate dateToLocalDate(Date date) {
//        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//    }
}

package com.bar_raw_materials.dto.goodsReceiptNote;

import com.bar_raw_materials.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGrnDTO {
    private Integer id;
    private Integer vendorId;
    private User createdBy;
    private String receivedBy;
    private LocalDate dateReceived;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String invoiceImage;
}

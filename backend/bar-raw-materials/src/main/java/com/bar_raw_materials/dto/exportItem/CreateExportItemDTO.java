package com.bar_raw_materials.dto.exportItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateExportItemDTO {
    private Integer grnItemId;
    private Integer quantityTake;
    private Integer salesItemId;
}

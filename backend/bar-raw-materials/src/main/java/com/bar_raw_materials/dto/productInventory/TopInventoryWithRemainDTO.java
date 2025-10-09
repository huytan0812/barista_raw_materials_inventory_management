package com.bar_raw_materials.dto.productInventory;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class TopInventoryWithRemainDTO {
    private List<CurrentInventoryDTO> topInventories;
    private BigDecimal totalRemainInventories;

    public TopInventoryWithRemainDTO(
            List<CurrentInventoryDTO> topInventories,
            BigDecimal totalRemainInventories
    ) {
        this.topInventories = topInventories;
        this.totalRemainInventories = totalRemainInventories;
    }
}

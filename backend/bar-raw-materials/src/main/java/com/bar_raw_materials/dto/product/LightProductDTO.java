package com.bar_raw_materials.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LightProductDTO {
    private Integer productId;
    private String name;
    private BigDecimal listPrice;
}

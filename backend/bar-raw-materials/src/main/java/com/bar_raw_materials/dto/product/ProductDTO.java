package com.bar_raw_materials.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Integer productId;
    private String sku;
    private String name;
    private String unit;
    private BigDecimal packSize;
    private String description;
    private String imageName;
    private String categoryName;
    private Integer minQuantity;
    private Integer maxQuantity;
    private BigDecimal listPrice;
}

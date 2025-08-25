package com.bar_raw_materials.dto.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductDTO {
    String sku;
    String name;
    Integer baseUnitId;
    BigDecimal packSize;
    String description;
    String imageName;
    Integer categoryId;
    BigDecimal unitPrice;
}

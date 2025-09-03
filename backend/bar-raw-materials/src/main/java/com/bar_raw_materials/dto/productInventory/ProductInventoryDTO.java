package com.bar_raw_materials.dto.productInventory;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductInventoryDTO {
    private Integer id;
    private String productName;
    private String periodLabel;
    private Integer startingQuantity;
    private BigDecimal startingInventory;
    private Integer importQuantity;
    private BigDecimal importAmount;
    private Integer exportQuantity;
    private BigDecimal cogs;
}

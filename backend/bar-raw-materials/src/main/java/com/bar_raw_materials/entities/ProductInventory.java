package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "product_inventory")
public class ProductInventory {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "businessPeriodId", nullable = false)
    private BusinessPeriod businessPeriod;

    @NotNull
    @Column(name = "month", nullable = false)
    private Integer month;

    @NotNull
    @Column(name = "startingQuantity", nullable = false)
    private Integer startingQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "startingInventory", nullable = false, precision = 20, scale = 6)
    private BigDecimal startingInventory;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importQuantity", nullable = false)
    private Integer importQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importAmount", nullable = false, precision = 20, scale = 6)
    private BigDecimal importAmount;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "exportQuantity", nullable = false)
    private Integer exportQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "cogs", nullable = false, precision = 20, scale = 6)
    private BigDecimal cogs;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "revenue", nullable = false, precision = 20, scale = 6)
    private BigDecimal revenue;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "outputVAT", nullable = false, precision = 20, scale = 6)
    private BigDecimal outputVAT;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "inputVAT", nullable = false, precision = 20, scale = 6)
    private BigDecimal inputVAT;

}
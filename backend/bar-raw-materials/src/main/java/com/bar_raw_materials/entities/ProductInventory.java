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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Column(name = "startingQuantity", nullable = true)
    private Integer startingQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "startingInventory", nullable = true, precision = 20, scale = 2)
    private BigDecimal startingInventory;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importQuantity", nullable = true)
    private Integer importQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importAmount", nullable = true, precision = 20, scale = 2)
    private BigDecimal importAmount;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "exportQuantity", nullable = true)
    private Integer exportQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "cogs", nullable = true, precision = 20, scale = 2)
    private BigDecimal cogs;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "revenue", nullable = true, precision = 20, scale = 2)
    private BigDecimal revenue;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "outputVAT", nullable = true, precision = 20, scale = 2)
    private BigDecimal outputVAT;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "inputVAT", nullable = true, precision = 20, scale = 2)
    private BigDecimal inputVAT;

    public ProductInventory() {}

    public ProductInventory(Product product,
                            BusinessPeriod businessPeriod
    ) {
        this.product = product;
        this.businessPeriod = businessPeriod;
        this.startingQuantity = 0;
        this.startingInventory = BigDecimal.ZERO;
        this.importQuantity = 0;
        this.importAmount = BigDecimal.ZERO;
        this.exportQuantity = 0;
        this.cogs = BigDecimal.ZERO;
        this.revenue = BigDecimal.ZERO;
        this.outputVAT = BigDecimal.ZERO;
        this.inputVAT = BigDecimal.ZERO;
    }
}
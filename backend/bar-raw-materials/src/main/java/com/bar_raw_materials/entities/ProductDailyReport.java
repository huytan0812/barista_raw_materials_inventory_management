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
@Table(name = "product_daily_report")
public class ProductDailyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "reportId", nullable = false)
    private DailyReport report;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "importQuantity", nullable = false)
    private Integer importQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importAmount", nullable = false, precision = 20, scale = 2)
    private BigDecimal importAmount;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "exportQuantity", nullable = false)
    private Integer exportQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "cogs", nullable = false, precision = 20, scale = 2)
    private BigDecimal cogs;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "revenue", nullable = false, precision = 20, scale = 2)
    private BigDecimal revenue;

}
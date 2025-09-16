package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "goods_receipt_item")
public class GoodsReceiptItem {
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
    @JoinColumn(name = "grnId", nullable = false)
    private GoodsReceiptNote grn;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "quantityImport", nullable = false)
    private Integer quantityImport;

    @ColumnDefault("0")
    @Column(name = "quantityRemain")
    private Integer quantityRemain;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "unitCost", nullable = false, precision = 20, scale = 2)
    private BigDecimal unitCost;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "vatRate", nullable = false)
    private Float vatRate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "batchId", nullable = false)
    private Batch batch;

}
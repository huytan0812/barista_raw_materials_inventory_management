package com.bar_raw_materials;

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
    private com.bar_raw_materials.Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "grnId", nullable = false)
    private com.bar_raw_materials.GoodsReceiptNote grn;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "quantityImport", nullable = false)
    private Integer quantityImport;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "quantityRemain", nullable = false)
    private Integer quantityRemain;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "unitCost", nullable = false, precision = 20, scale = 2)
    private BigDecimal unitCost;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'0'")
    @Column(name = "lotNumber", nullable = false, length = 50)
    private String lotNumber;

    @NotNull
    @Column(name = "mfgDate", nullable = false)
    private LocalDate mfgDate;

    @NotNull
    @Column(name = "expDate", nullable = false)
    private LocalDate expDate;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "vatRate", nullable = false)
    private Float vatRate;

}
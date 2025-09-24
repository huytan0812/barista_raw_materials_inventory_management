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
@Table(name = "sales_order_item")
public class SalesOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "salesOrderId", nullable = false)
    private SalesOrder salesOrder;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "quantitySold", nullable = false)
    private Integer quantitySold;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "unitPrice", nullable = false, precision = 20, scale = 2)
    private BigDecimal unitPrice;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "discount", nullable = false)
    private Float discount;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "vatRate", nullable = false)
    private Float vatRate;

    @Lob
    @Column(name = "note", nullable = false)
    private String note;

}
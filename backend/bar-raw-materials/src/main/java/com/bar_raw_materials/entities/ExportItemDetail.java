package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "export_item_details")
public class ExportItemDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "orderItemId", nullable = false)
    private SalesOrderItem orderItem;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'0'")
    @Column(name = "lotNumber", nullable = false, length = 50)
    private String lotNumber;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "quantityTake", nullable = false)
    private Integer quantityTake;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "unitCost", nullable = false, precision = 20, scale = 2)
    private BigDecimal unitCost;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "grnItemId", nullable = false)
    private GoodsReceiptItem grnItem;

}
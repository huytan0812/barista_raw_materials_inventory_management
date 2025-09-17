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
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'0'")
    @Column(name = "sku", nullable = false, length = 50)
    private String sku;

    @Size(max = 100)
    @NotNull
    @ColumnDefault("'0'")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    // Consider to implement native query to optimize code as EAGER is expensive
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("(0)")
    @JoinColumn(name = "baseUnitId", nullable = false)
    private BaseUnit baseUnit;

    @NotNull
    @ColumnDefault("0.000000")
    @Column(name = "packSize", nullable = false, precision = 20, scale = 6)
    private BigDecimal packSize;

    @Lob
    @Column(name = "description")
    private String description;

    @Size(max = 255)
    @ColumnDefault("''")
    @Column(name = "imageName")
    private String imageName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoryId")
    private Category category;

    @Column(name = "minQuantity")
    private Integer minQuantity;

    @Column(name = "maxQuantity")
    private Integer maxQuantity;

    @Column(name = "listPrice", precision = 20, scale = 6)
    private BigDecimal listPrice;

}
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
@Table(name = "disposal_batch")
public class DisposalBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "batchId", nullable = false)
    private Batch batch;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "disposalQuantity", nullable = false)
    private Integer disposalQuantity;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "disposalValue", nullable = false, precision = 20, scale = 2)
    private BigDecimal disposalValue;

}
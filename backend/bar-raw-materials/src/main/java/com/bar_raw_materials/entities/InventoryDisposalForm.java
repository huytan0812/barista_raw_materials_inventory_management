package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "inventory_disposal_form")
public class InventoryDisposalForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "disposeDate", nullable = false)
    private Instant disposeDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("(0)")
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "isConfirmed", nullable = false)
    private Boolean isConfirmed = false;

    @NotNull
    @ColumnDefault("0.00")
    @Column(name = "devaluationValue", nullable = false, precision = 20, scale = 2)
    private BigDecimal devaluationValue;

}
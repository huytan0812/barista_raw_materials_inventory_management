package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "daily_reports")
public class DailyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "reportDate", nullable = false)
    private LocalDate reportDate;

    @NotNull
    @Column(name = "dateCreate", nullable = false)
    private Instant dateCreate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("(0)")
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "itemSold", nullable = false)
    private Integer itemSold;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "revenue", nullable = false, precision = 20, scale = 6)
    private BigDecimal revenue;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "cogs", nullable = false, precision = 20, scale = 6)
    private BigDecimal cogs;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "itemImport", nullable = false)
    private Integer itemImport;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "importAmount", nullable = false, precision = 20, scale = 6)
    private BigDecimal importAmount;

}
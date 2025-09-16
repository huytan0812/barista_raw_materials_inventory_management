package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "batch")
public class Batch {
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
    @Column(name = "mfgDate", nullable = false)
    private LocalDate mfgDate;

    @NotNull
    @Column(name = "expDate", nullable = false)
    private LocalDate expDate;

    @Size(max = 50)
    @NotNull
    @Column(name = "lotNumber", nullable = false, length = 50)
    private String lotNumber;

}
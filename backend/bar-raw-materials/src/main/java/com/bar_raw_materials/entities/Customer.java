package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @ColumnDefault("'0'")
    @Column(name = "name", length = 50)
    private String name;

    @NotNull
    @Column(name = "dateCreated", nullable = false)
    private Instant dateCreated;

    @Column(name = "lastBuy", nullable = true)
    private Instant lastBuy;

    @Size(max = 15)
    @ColumnDefault("'0'")
    @Column(name = "phoneNumber", length = 15, unique = true)
    private String phoneNumber;

    @Size(max = 15)
    @ColumnDefault("'bronze'")
    @Column(name = "customerRank", nullable = false, length = 15)
    private String customerRank;

    @ColumnDefault("(0)")
    @Column(name = "bonusDiscount", nullable = true)
    private Float bonusDiscount;

    @ColumnDefault("(0)")
    @Column(name = "totalBuy", nullable = true, precision = 20, scale = 6)
    private BigDecimal totalBuy;

}
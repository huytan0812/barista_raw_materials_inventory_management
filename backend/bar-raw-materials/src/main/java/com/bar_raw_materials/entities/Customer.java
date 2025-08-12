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
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @ColumnDefault("'0'")
    @Column(name = "firstName", length = 50)
    private String firstName;

    @Size(max = 50)
    @ColumnDefault("''")
    @Column(name = "lastName", length = 50)
    private String lastName;

    @Size(max = 15)
    @ColumnDefault("'0'")
    @Column(name = "phoneNumber", length = 15)
    private String phoneNumber;

    @Size(max = 15)
    @NotNull
    @ColumnDefault("'bronze'")
    @Column(name = "rank", nullable = false, length = 15)
    private String rank;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "bonusDiscount", nullable = false)
    private Float bonusDiscount;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "totalBuy", nullable = false, precision = 20, scale = 6)
    private BigDecimal totalBuy;

}
package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "base_unit")
public class BaseUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Size(max = 10)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "notation", nullable = false, length = 10)
    private String notation;

}
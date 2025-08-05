package com.bar_raw_materials.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "vendor")
public class Vendor {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 150)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Size(max = 30)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "taxCode", nullable = false, length = 30)
    private String taxCode;

    @Size(max = 15)
    @ColumnDefault("''")
    @Column(name = "phoneNumber", length = 15)
    private String phoneNumber;

    @Size(max = 15)
    @ColumnDefault("''")
    @Column(name = "email", length = 15)
    private String email;

    @Size(max = 15)
    @ColumnDefault("''")
    @Column(name = "address", length = 15)
    private String address;

}
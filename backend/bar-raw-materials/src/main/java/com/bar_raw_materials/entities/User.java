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
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'admin'")
    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Size(max = 255)
    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 100)
    @NotNull
    @Column(name = "firstName", nullable = false, length = 100)
    private String firstName;

    @Size(max = 100)
    @NotNull
    @Column(name = "lastName", nullable = false, length = 100)
    private String lastName;

    @Size(max = 255)
    @NotNull
    @ColumnDefault("'admin@example.com'")
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 15)
    @NotNull
    @Column(name = "phoneNumber", nullable = false, length = 15)
    private String phoneNumber;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "gender", nullable = false)
    private Boolean gender = false;

    @NotNull
    @ColumnDefault("(0)")
    @Column(name = "isActive", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @ColumnDefault("(0)")
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

}
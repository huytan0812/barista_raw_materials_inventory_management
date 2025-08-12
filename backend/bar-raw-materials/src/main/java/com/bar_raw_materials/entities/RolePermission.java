package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "role_permission")
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("0")
    @JoinColumn(name = "permissionId", nullable = false)
    private Permission permission;

}
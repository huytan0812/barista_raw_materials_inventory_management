package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "vendor_payment")
public class VendorPayment {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendorId", nullable = false)
    private Vendor vendor;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "paymentMethod", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "paymentDate")
    private Instant paymentDate;

}
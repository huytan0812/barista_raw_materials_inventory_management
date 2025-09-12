package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "goods_receipt_note")
public class GoodsReceiptNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendorId", nullable = false)
    private Vendor vendor;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "businessPeriodId", nullable = false)
    private BusinessPeriod businessPeriod;

    @Column(name = "dateCreate")
    private Instant dateCreate;

    @Column(name = "totalAmount", precision = 20, scale = 6)
    private BigDecimal totalAmount;

    @Size(max = 30)
    @NotNull
    @Column(name = "invoiceNumber", nullable = false, length = 30, unique = true)
    private String invoiceNumber;

    @ColumnDefault("(0)")
    @Column(name = "invoiceDate")
    private LocalDate invoiceDate;

    @Size(max = 255)
    @Column(name = "invoiceImage")
    private String invoiceImage;

    @NotNull
    @Column(name = "isConfirmed", nullable = false)
    private Boolean isConfirmed = false;

    @Size(max = 50)
    @Column(name = "receivedBy", length = 50)
    private String receivedBy;

    @Column(name = "dateReceived")
    private LocalDate dateReceived;

}
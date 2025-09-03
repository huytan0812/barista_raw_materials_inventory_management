package com.bar_raw_materials.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "business_period")
public class BusinessPeriod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "period_type", nullable = false)
    private String periodType;

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "endDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "label", nullable = false)
    private String label;

    // Constructors
    public BusinessPeriod() {}

    public BusinessPeriod(String periodType, LocalDate startDate, LocalDate endDate, String label) {
        this.periodType = periodType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.label = label;
    }
}
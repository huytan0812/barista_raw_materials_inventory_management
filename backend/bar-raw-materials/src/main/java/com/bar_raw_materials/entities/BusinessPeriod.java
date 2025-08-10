package com.bar_raw_materials.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "business_period")
public class BusinessPeriod {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

}
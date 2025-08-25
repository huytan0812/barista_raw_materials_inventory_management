package com.bar_raw_materials.dto.baseUnit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseUnitDTO {
    private Integer id;
    private String name;
    private String notation;
}

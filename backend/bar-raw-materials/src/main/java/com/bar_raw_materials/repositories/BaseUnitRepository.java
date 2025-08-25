package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.baseUnit.BaseUnitDTO;
import com.bar_raw_materials.entities.BaseUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BaseUnitRepository extends JpaRepository<BaseUnit, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.baseUnit.BaseUnitDTO(bu.id, bu.name, bu.notation)" +
                    " FROM " +
                    "BaseUnit bu"
    )
    List<BaseUnitDTO> findAllBaseUnit();

    BaseUnit findBaseUnitById(int id);
}

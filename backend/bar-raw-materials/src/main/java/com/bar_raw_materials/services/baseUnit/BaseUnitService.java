package com.bar_raw_materials.services.baseUnit;

import java.util.List;
import com.bar_raw_materials.dto.baseUnit.BaseUnitDTO;
import com.bar_raw_materials.entities.BaseUnit;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;

public interface BaseUnitService extends EntityService {
    List<BaseUnitDTO> getAll();
    Page<BaseUnitDTO> getPage(int page, int size);
    BaseUnit getDetails(int id);
}

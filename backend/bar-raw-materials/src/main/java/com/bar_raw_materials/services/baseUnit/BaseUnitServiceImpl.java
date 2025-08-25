package com.bar_raw_materials.services.baseUnit;

import java.util.List;
import com.bar_raw_materials.dto.baseUnit.BaseUnitDTO;
import com.bar_raw_materials.entities.BaseUnit;
import com.bar_raw_materials.repositories.BaseUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BaseUnitServiceImpl implements BaseUnitService {
    private final BaseUnitRepository baseUnitRepository;

    @Override
    public List<BaseUnitDTO> getAll() {
        return baseUnitRepository.findAllBaseUnit();
    }

    @Override
    public BaseUnit getDetails(int id) {
        return baseUnitRepository.findBaseUnitById(id);
    }
}

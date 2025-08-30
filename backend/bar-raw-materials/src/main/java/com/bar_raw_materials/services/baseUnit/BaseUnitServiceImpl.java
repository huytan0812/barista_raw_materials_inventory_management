package com.bar_raw_materials.services.baseUnit;

import java.util.List;
import com.bar_raw_materials.dto.baseUnit.BaseUnitDTO;
import com.bar_raw_materials.entities.BaseUnit;
import com.bar_raw_materials.repositories.BaseUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Page<BaseUnitDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return baseUnitRepository.pagination(pageable);
    }

    @Override
    public BaseUnit getDetails(int id) {
        return baseUnitRepository.findBaseUnitById(id);
    }
}

package com.bar_raw_materials.services.exportItem;

import com.bar_raw_materials.repositories.ExportItemDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportEntityServiceImpl implements ExportItemService{
    private final ExportItemDetailRepository exportItemDetailRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<?> getPage(int page, int size) {
        return null;
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }
}

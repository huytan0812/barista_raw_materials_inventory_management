package com.bar_raw_materials.services.productDailyReport;

import com.bar_raw_materials.dto.productDailyReport.ProductDailyReportDTO;
import com.bar_raw_materials.entities.ProductDailyReport;
import com.bar_raw_materials.repositories.ProductDailyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductDailyReportServiceImpl implements ProductDailyReportService {
    private final ProductDailyReportRepository productDailyReportRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<ProductDailyReport> getPage(int page, int size) {
        return null;
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }

    @Override
    public Page<ProductDailyReportDTO> findByDailyReportId(int dailyReportId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("importQuantity", "cogs").descending());
        return productDailyReportRepository.getPageOfPdrDTOByReportId(dailyReportId, pageable);
    }
}

package com.bar_raw_materials.services.productDailyReport;

import com.bar_raw_materials.dto.productDailyReport.ProductDailyReportDTO;
import com.bar_raw_materials.entities.ProductDailyReport;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductDailyReportService extends EntityService {
    Page<ProductDailyReportDTO> findByDailyReportId(int dailyReportId, int page, int size);
}

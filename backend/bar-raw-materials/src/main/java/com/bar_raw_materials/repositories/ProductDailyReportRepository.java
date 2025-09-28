package com.bar_raw_materials.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.ProductDailyReport;
import org.springframework.data.jpa.repository.Query;

public interface ProductDailyReportRepository extends JpaRepository<ProductDailyReport, Integer> {
    @Query(
            value="SELECT p FROM ProductDailyReport p JOIN FETCH p.product" +
                    " JOIN FETCH p.report WHERE p.report.id=:dailyReportId"
    )
    Page<ProductDailyReport> findByDailyReportId(Pageable pageable, int dailyReportId);
}

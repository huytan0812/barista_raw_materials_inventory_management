package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.productDailyReport.ProductDailyReportDTO;
import com.bar_raw_materials.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.ProductDailyReport;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductDailyReportRepository extends JpaRepository<ProductDailyReport, Integer> {
    @Query(
            value="SELECT p FROM ProductDailyReport p JOIN FETCH p.product" +
                    " JOIN FETCH p.report WHERE p.report.id=:dailyReportId"
    )
    Page<ProductDailyReport> getPageByDailyReportId(Pageable pageable, int dailyReportId);

    @Query(
            value="SELECT new com.bar_raw_materials.dto.productDailyReport.ProductDailyReportDTO(" +
                    " p.id, p.product.name AS productName, p.importQuantity, p.importAmount, " +
                    "p.exportQuantity, p.cogs, p.revenue" +
                    ") FROM ProductDailyReport p JOIN p.product JOIN p.report" +
                    " WHERE p.report.id=:reportId"
    )
    Page<ProductDailyReportDTO> getPageOfPdrDTOByReportId(Integer reportId, Pageable pageable);

    @Query(
            value="SELECT p FROM ProductDailyReport p JOIN FETCH p.product" +
                    " WHERE p.report.id=:dailyReportId"
    )
    List<ProductDailyReport> findAllByDailyReportId(int dailyReportId);
}

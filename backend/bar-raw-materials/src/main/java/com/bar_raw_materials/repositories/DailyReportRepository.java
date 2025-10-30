package com.bar_raw_materials.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bar_raw_materials.entities.DailyReport;
import org.springframework.data.jpa.repository.Query;

public interface DailyReportRepository extends JpaRepository<DailyReport, Integer> {
    @Query(
            value="SELECT d FROM DailyReport d JOIN FETCH d.createdBy WHERE d.id=:id"
    )
    DailyReport getDailyReportById(int id);

    @Query(
            value="SELECT d FROM DailyReport d JOIN FETCH d.createdBy"
    )
    Page<DailyReport> getPage(Pageable pageable);

    @Query(
            value="SELECT d FROM DailyReport d ORDER BY d.id DESC limit 1"
    )
    DailyReport getCurrentDailyReport();
}

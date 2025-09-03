package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.BusinessPeriod;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;

public interface BusinessPeriodRepository extends JpaRepository<BusinessPeriod, Integer> {
    @Query(
            value="SELECT bp FROM BusinessPeriod bp" +
                    " ORDER BY bp.id DESC LIMIT 1"
    )
    BusinessPeriod getCurrent();
}

package com.bar_raw_materials.services.dailyReport;

import com.bar_raw_materials.entities.DailyReport;
import com.bar_raw_materials.services.EntityService;

public interface DailyReportService extends EntityService {
    DailyReport generateOrUpdate();
    DailyReport generateDailyReport();
    DailyReport updateDailyReport(DailyReport dailyReport);
    boolean isExistingDailyReportToday(DailyReport dailyReport);
}

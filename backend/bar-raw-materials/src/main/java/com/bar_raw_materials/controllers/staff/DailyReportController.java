package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.DailyReport;
import com.bar_raw_materials.services.dailyReport.DailyReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiStaff}/dailyReport")
public class DailyReportController extends BaseStaffController{
    DailyReportService dailyReportService;
    @Autowired
    public DailyReportController(
            DailyReportService dailyReportService
    ) {
        super(dailyReportService);
        this.dailyReportService = dailyReportService;
    }

    @GetMapping("generateDailyReport")
    public ResponseEntity<Integer> generateDailyReport() {
        DailyReport dailyReport = dailyReportService.generateDailyReport();
        return new ResponseEntity<>(dailyReport.getId(), HttpStatus.OK);
    }
}

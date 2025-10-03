package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.productDailyReport.ProductDailyReportDTO;
import com.bar_raw_materials.services.productDailyReport.ProductDailyReportService;
import io.micrometer.common.lang.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${apiStaff}/productDailyReport")
public class ProductDailyReportController extends BaseStaffController{
    ProductDailyReportService productDailyReportService;
    public ProductDailyReportController(ProductDailyReportService productDailyReportService) {
        super(productDailyReportService);
        this.productDailyReportService = productDailyReportService;
    }

    @GetMapping("dailyReport/{id}/list")
    public ResponseEntity<Page<ProductDailyReportDTO>> getPageByDailyReportId(
            @PathVariable("id") Integer id,
            @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
            @Nullable @RequestParam(defaultValue="5", name="size") Integer size
    ) {
        Page<ProductDailyReportDTO> responseData = productDailyReportService.findByDailyReportId(id, page, size);
        return ResponseEntity.ok(responseData);
    }
}

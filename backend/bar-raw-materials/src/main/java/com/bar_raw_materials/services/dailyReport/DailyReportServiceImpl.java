package com.bar_raw_materials.services.dailyReport;

import com.bar_raw_materials.entities.*;
import com.bar_raw_materials.repositories.DailyReportRepository;
import com.bar_raw_materials.repositories.ProductRepository;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.repositories.SalesOrderItemRepository;
import com.bar_raw_materials.repositories.ProductDailyReportRepository;
import com.bar_raw_materials.utils.AuthUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyReportServiceImpl implements DailyReportService {
    private final DailyReportRepository dailyReportRepository;
    private final ProductRepository productRepository;
    private final GoodsReceiptItemRepository grnItemRepository;
    private final SalesOrderItemRepository salesItemRepository;
    private final ProductDailyReportRepository pdrRepository;
    private final AuthUtils authUtils;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<DailyReport> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return dailyReportRepository.getPage(pageable);
    }

    @Override
    public DailyReport getDetails(int id) {
        return dailyReportRepository.getDailyReportById(id);
    }

    @Override
    @Transactional
    public DailyReport generateOrUpdate() {
        DailyReport dailyReport = dailyReportRepository.getCurrentDailyReport();
        if (dailyReport == null || !isExistingDailyReportToday(dailyReport)) {
            return generateDailyReport();
        }
        return updateDailyReport(dailyReport);
    }

    @Override
    @Transactional
    public DailyReport generateDailyReport() {
        DailyReport dailyReport = new DailyReport();
        User createdBy = authUtils.getCurrentAuthorizedUser();
        LocalDate reportDate = LocalDate.now();
        dailyReport.setCreatedBy(createdBy);
        dailyReport.setReportDate(reportDate);
        dailyReportRepository.save(dailyReport);
        // get all product
        List<Product> products = productRepository.findAllWithoutRelatedEntities();
        // datetime or instant comparison will compare both date and time
        // so to get all records in a day, use both the start and end of the day
        Instant startOfDay = reportDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = reportDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<ProductDailyReport> productDailyReports = new ArrayList<>();

        for (Product product : products) {
            ProductDailyReport pdr = new ProductDailyReport();
            pdr.setReport(dailyReport);
            pdr.setProduct(product);
            Integer totalImportQuantity = 0;
            BigDecimal totalImportAmount = BigDecimal.ZERO;
            // get all grn items
            List<GoodsReceiptItem> grnItems = grnItemRepository.findAllByDateAndProductId(
                    startOfDay, endOfDay, product.getId()
            );
            System.out.println("Grn items: " + grnItems);
            for (GoodsReceiptItem grnItem : grnItems) {
                totalImportQuantity += grnItem.getQuantityImport();
                totalImportAmount = totalImportAmount.add(
                        BigDecimal.valueOf(grnItem.getQuantityImport())
                                .multiply(grnItem.getUnitCost())
                );
            }
            pdr.setImportQuantity(totalImportQuantity);
            pdr.setImportAmount(totalImportAmount);

            Integer totalQuantityExport = 0;
            BigDecimal totalCogs = BigDecimal.ZERO;
            BigDecimal totalRevenue = BigDecimal.ZERO;
            // get all sales items
            List<SalesOrderItem> salesItems = salesItemRepository.findAllByDateAndProductId(
                    startOfDay, endOfDay, product.getId()
            );
            for (SalesOrderItem salesItem : salesItems) {
                totalQuantityExport += salesItem.getQuantitySold();
                BigDecimal quantityExport = new BigDecimal(salesItem.getQuantitySold());
                BigDecimal discount = BigDecimal.valueOf(1 - salesItem.getDiscount());
                totalCogs = totalCogs.add(salesItem.getCogs());
                totalRevenue = totalRevenue.add(
                        quantityExport
                                .multiply(salesItem.getUnitPrice())
                                .multiply(discount)
                );
            }
            pdr.setExportQuantity(totalQuantityExport);
            pdr.setCogs(totalCogs);
            pdr.setRevenue(totalRevenue);
            productDailyReports.add(pdr);
        }
        pdrRepository.saveAll(productDailyReports);
        return dailyReport;
    }

    @Override
    @Transactional
    public DailyReport updateDailyReport(DailyReport dailyReport) {
        LocalDate reportDate = LocalDate.now();
        Instant startOfDay = reportDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = reportDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<ProductDailyReport> productDailyReports = pdrRepository.findAllByDailyReportId(dailyReport.getId());

        for (ProductDailyReport pdr : productDailyReports) {
            Integer totalImportQuantity = 0;
            BigDecimal totalImportAmount = BigDecimal.ZERO;
            // get all grn items
            List<GoodsReceiptItem> grnItems = grnItemRepository.findAllByDateAndProductId(
                    startOfDay, endOfDay, pdr.getProduct().getId()
            );
            for (GoodsReceiptItem grnItem : grnItems) {
                totalImportQuantity += grnItem.getQuantityImport();
                totalImportAmount = totalImportAmount.add(
                        BigDecimal.valueOf(grnItem.getQuantityImport())
                                .multiply(grnItem.getUnitCost())
                );
            }
            pdr.setImportQuantity(totalImportQuantity);
            pdr.setImportAmount(totalImportAmount);

            Integer totalQuantityExport = 0;
            BigDecimal totalCogs = BigDecimal.ZERO;
            BigDecimal totalRevenue = BigDecimal.ZERO;
            // get all sales items
            List<SalesOrderItem> salesItems = salesItemRepository.findAllByDateAndProductId(
                    startOfDay, endOfDay, pdr.getProduct().getId()
            );
            for (SalesOrderItem salesItem : salesItems) {
                totalQuantityExport += salesItem.getQuantitySold();
                BigDecimal quantityExport = new BigDecimal(salesItem.getQuantitySold());
                BigDecimal discount = BigDecimal.valueOf(1 - salesItem.getDiscount());
                totalCogs = totalCogs.add(salesItem.getCogs());
                totalRevenue = totalRevenue.add(
                        quantityExport
                                .multiply(salesItem.getUnitPrice())
                                .multiply(discount)
                );
            }
            pdr.setExportQuantity(totalQuantityExport);
            pdr.setCogs(totalCogs);
            pdr.setRevenue(totalRevenue);
            productDailyReports.add(pdr);
        }
        pdrRepository.saveAll(productDailyReports);
        return dailyReport;
    }

    @Override
    public boolean isExistingDailyReportToday(DailyReport dailyReport) {
        LocalDate reportDate = dailyReport.getReportDate();
        return reportDate.isEqual(LocalDate.now());
    }
}

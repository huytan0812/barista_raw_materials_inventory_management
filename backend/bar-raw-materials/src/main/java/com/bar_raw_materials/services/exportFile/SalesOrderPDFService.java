package com.bar_raw_materials.services.exportFile;

import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;

@Service
public class SalesOrderPDFService {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
    public ByteArrayInputStream exportSalesOrderToPdf(SalesOrder salesOrder, List<SalesOrderItem> items) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            BaseFont bf = BaseFont.createFont("D:/fonts/arial.ttf",
                    BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            // ===== HEADER =====
            Font headerFont = new Font(bf, 16, Font.BOLD);
            Paragraph header = new Paragraph("Phiếu xuất kho", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            document.add(new Paragraph(" ")); // empty line

            // ===== INFO SECTION =====
            Font infoFont = new Font(bf, 12, Font.NORMAL);
            String dateCreate = formatter.format(salesOrder.getDateCreated());

            document.add(new Paragraph("Mã số phiếu: " + salesOrder.getId(), infoFont));
            document.add(new Paragraph("Khách hàng: " + salesOrder.getCustomer().getName(), infoFont));
            document.add(new Paragraph(
                    "Người tạo phiếu: " + salesOrder.getCreatedBy().getFirstName() + " " + salesOrder.getCreatedBy().getLastName(),
                    infoFont
            ));
            document.add(new Paragraph("Ngày tạo phiếu: " + dateCreate, infoFont));
            document.add(new Paragraph(" ")); // empty line

            // ===== TABLE SECTION =====
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 2, 2, 2, 2, 2});

            // Table Header
            Font tableHeaderFont = new Font(bf, 12, Font.BOLD);
            Stream.of("Tên sản phẩm", "Số lượng xuất", "Đơn giá bán (đ)", "GVHB (đ)", "Giảm giá (%)", "Doanh thu chưa VAT (đ)")
                    .forEach(colTitle -> {
                        PdfPCell headerCell = new PdfPCell(new Phrase(colTitle, tableHeaderFont));
                        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        table.addCell(headerCell);
                    });

            // Table Rows
            BigDecimal totalRevenueBeforeVAT = BigDecimal.ZERO;
            BigDecimal totalCogs = BigDecimal.ZERO;
            Font tableBodyFont = new Font(bf, 12, Font.NORMAL);
            for (SalesOrderItem item : items) {
                table.addCell(new PdfPCell(new Phrase(item.getProduct().getName(), tableBodyFont)));
                // quantity export
                PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantitySold()), tableBodyFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(qtyCell);

                // unit price
                PdfPCell unitPriceCell = new PdfPCell(new Phrase(formatCurrency(item.getUnitPrice()), tableBodyFont));
                unitPriceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(unitPriceCell);

                // cogs
                PdfPCell cogs = new PdfPCell(new Phrase(formatCurrency(item.getCogs()), tableBodyFont));
                cogs.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cogs);
                totalCogs = totalCogs.add(item.getCogs());

                // discount
                PdfPCell discount = new PdfPCell(new Phrase(String.valueOf(item.getDiscount() * 100), tableBodyFont));
                discount.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(discount);

                // revenue per item
                BigDecimal itemRevenue = item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantitySold()))
                        .multiply(BigDecimal.valueOf(1 - item.getDiscount()));
                PdfPCell totalCell = new PdfPCell(new Phrase(formatCurrency(itemRevenue), tableBodyFont));
                totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(totalCell);
                totalRevenueBeforeVAT = totalRevenueBeforeVAT.add(itemRevenue);
            }
            document.add(table);

            document.add(new Paragraph(" ")); // empty line

            // ===== TOTAL PAY =====
            Font totalFont = new Font(bf, 13, Font.BOLD);
            Paragraph totalRevenue = new Paragraph("Tổng doanh thu (chưa VAT): " + formatCurrency(totalRevenueBeforeVAT) + "đ", totalFont);
            totalRevenue.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalRevenue);

            Paragraph totalCogsRow = new Paragraph("Tổng GVHB: " + formatCurrency(totalCogs) + "đ", totalFont);
            totalCogsRow.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalCogsRow);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream exportSalesInvoiceToPDF(SalesOrder salesOrder, List<SalesOrderItem> items) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            BaseFont bf = BaseFont.createFont("D:/fonts/arial.ttf",
                    BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            // ===== HEADER =====
            Font headerFont = new Font(bf, 16, Font.BOLD);
            Paragraph header = new Paragraph("Hóa đơn bán hàng", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            document.add(new Paragraph(" ")); // empty line

            // ===== INFO SECTION =====
            Font infoFont = new Font(bf, 12, Font.NORMAL);
            String dateCreate = formatter.format(salesOrder.getDateCreated());

            document.add(new Paragraph("Số hóa đơn: " + salesOrder.getId(), infoFont));
            document.add(new Paragraph("Khách hàng: " + salesOrder.getCustomer().getName(), infoFont));
            document.add(new Paragraph(
                    "Người tạo hóa đơn: " + salesOrder.getCreatedBy().getFirstName() + " " + salesOrder.getCreatedBy().getLastName(),
                    infoFont
            ));
            document.add(new Paragraph("Ngày tạo hóa đơn: " + dateCreate, infoFont));
            document.add(new Paragraph(" ")); // empty line

            // ===== TABLE SECTION =====
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 2, 2, 2, 2, 2});

            // Table Header
            Font tableHeaderFont = new Font(bf, 12, Font.BOLD);
            Stream.of("Tên sản phẩm", "Số lượng bán", "Đơn giá bán (đ)", "Giảm giá (%)", "VAT (%)", "Thanh toán (đ)")
                    .forEach(colTitle -> {
                        PdfPCell headerCell = new PdfPCell(new Phrase(colTitle, tableHeaderFont));
                        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        table.addCell(headerCell);
                    });

            // Table Rows
            Font tableBodyFont = new Font(bf, 12, Font.NORMAL);
            for (SalesOrderItem item : items) {
                // product name
                table.addCell(new PdfPCell(new Phrase(item.getProduct().getName(), tableBodyFont)));
                // quantity sold
                PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantitySold()), tableBodyFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(qtyCell);

                // unit price
                PdfPCell unitPriceCell = new PdfPCell(new Phrase(formatCurrency(item.getUnitPrice()), tableBodyFont));
                unitPriceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(unitPriceCell);

                // discount
                PdfPCell discount = new PdfPCell(new Phrase(String.valueOf(item.getDiscount() * 100), tableBodyFont));
                discount.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(discount);

                // VAT
                PdfPCell vat = new PdfPCell(new Phrase(String.valueOf(item.getVatRate() * 100), tableBodyFont));
                vat.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(vat);

                // pay per item
                BigDecimal payPerItem = item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantitySold()))
                        .multiply(BigDecimal.valueOf(1 - item.getDiscount()))
                        .multiply(BigDecimal.valueOf(1 + item.getVatRate()));
                PdfPCell totalCell = new PdfPCell(new Phrase(formatCurrency(payPerItem), tableBodyFont));
                totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(totalCell);
            }
            document.add(table);

            document.add(new Paragraph(" ")); // empty line

            // ===== TOTAL PAY =====
            Font totalFont = new Font(bf, 13, Font.BOLD);
            Paragraph totalRevenue = new Paragraph("Tổng khách hàng phải thanh toán: " + formatCurrency(salesOrder.getTotalAmount()) + "đ", totalFont);
            totalRevenue.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalRevenue);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private static String formatCurrency(BigDecimal value) {
        BigDecimal rounded = value.setScale(0, RoundingMode.HALF_UP);
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return formatter.format(rounded);
    }
}

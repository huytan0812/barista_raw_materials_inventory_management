package com.bar_raw_materials.services.exportFile;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Stream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.text.NumberFormat;
import java.util.Locale;

import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class GrnPDFService {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
    public ByteArrayInputStream exportPdf(GoodsReceiptNote grn, List<GoodsReceiptItem> items) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            BaseFont bf = BaseFont.createFont("D:/fonts/arial.ttf",
                    BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            // ===== HEADER =====
            Font headerFont = new Font(bf, 16, Font.BOLD);
            Paragraph header = new Paragraph("Phiếu nhập kho", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            document.add(new Paragraph(" ")); // empty line

            // ===== INFO SECTION =====
            Font infoFont = new Font(bf, 12, Font.NORMAL);
            String dateCreate = formatter.format(grn.getDateCreate());
            String invoiceDate = formatter.format(grn.getInvoiceDate());

            document.add(new Paragraph("Mã số phiếu: " + grn.getId(), infoFont));
            document.add(new Paragraph("Nhà cung cấp: " + grn.getVendor().getName(), infoFont));
            document.add(new Paragraph("Người nhận: " + grn.getReceivedBy(), infoFont));
            document.add(new Paragraph(
                    "Người tạo phiếu: " + grn.getCreatedBy().getFirstName() + " " + grn.getCreatedBy().getLastName(),
                    infoFont
            ));
            document.add(new Paragraph("Ngày tạo phiếu: " + dateCreate, infoFont));
            document.add(new Paragraph("Số hóa đơn: " + grn.getInvoiceNumber(), infoFont));
            document.add(new Paragraph("Ngày trên hóa đơn: " + invoiceDate, infoFont));

            document.add(new Paragraph(" ")); // empty line

            // ===== TABLE SECTION =====
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 2, 2, 2, 2, 2});

            // Table Header
            Font tableHeaderFont = new Font(bf, 12, Font.BOLD);
            Stream.of("Tên sản phẩm", "Mã số lô", "Số lượng nhập", "Đơn giá nhập (đ)", "VAT đầu vào (%)", "Phải trả (đ)")
                    .forEach(colTitle -> {
                        PdfPCell headerCell = new PdfPCell(new Phrase(colTitle, tableHeaderFont));
                        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        table.addCell(headerCell);
                    });

            // Table Rows
            Font tableBodyFont = new Font(bf, 12, Font.NORMAL);
            for (GoodsReceiptItem item : items) {
                table.addCell(new PdfPCell(new Phrase(item.getProduct().getName(), tableBodyFont)));
                table.addCell(new PdfPCell(new Phrase(item.getBatch().getLotNumber(), tableBodyFont)));
                // quantity import
                PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantityImport()), tableBodyFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(qtyCell);

                // unit cost
                PdfPCell unitPriceCell = new PdfPCell(new Phrase(formatCurrency(item.getUnitCost()), tableBodyFont));
                unitPriceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(unitPriceCell);

                // VAT
                PdfPCell vatCell = new PdfPCell(new Phrase(String.valueOf(item.getVatRate() * 100), tableBodyFont));
                vatCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(vatCell);

                // total pay
                BigDecimal pay = item.getUnitCost()
                        .multiply(BigDecimal.valueOf(item.getQuantityImport()))
                        .multiply(BigDecimal.valueOf(item.getVatRate() + 1));
                PdfPCell totalCell = new PdfPCell(new Phrase(formatCurrency(pay), tableBodyFont));
                totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(totalCell);
            }
            document.add(table);

            document.add(new Paragraph(" ")); // empty line

            // ===== TOTAL PAY =====
            Font totalFont = new Font(bf, 13, Font.BOLD);
            Paragraph totalParagraph = new Paragraph("Tổng cộng phải trả: " + formatCurrency(grn.getTotalAmount()) + "đ", totalFont);
            totalParagraph.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalParagraph);

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

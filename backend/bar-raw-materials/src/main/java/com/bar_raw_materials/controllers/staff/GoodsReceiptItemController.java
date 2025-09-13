package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.goodsReceiptNote.GoodsReceiptNoteService;
import com.bar_raw_materials.services.product.ProductService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.services.goodsReceiptItem.GoodsReceiptItemService;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;

@RestController
@RequestMapping("${apiStaff}/grnItem")
public class GoodsReceiptItemController extends BaseStaffController {
    GoodsReceiptItemService grnItemService;
    GoodsReceiptNoteService grnService;
    ProductService productService;
    @Autowired
    public GoodsReceiptItemController(
            GoodsReceiptItemService grnItemService,
            GoodsReceiptNoteService grnService,
            ProductService productService
    ) {
        super(grnItemService);
        this.grnItemService = grnItemService;
        this.grnService = grnService;
        this.productService = productService;
    }

    @GetMapping("grn/{grnId}")
    public ResponseEntity<Page<GoodsReceiptItem>> getPageByGrnId(
            @PathVariable("grnId") Integer grnId,
            @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
            @Nullable @RequestParam(defaultValue="5", name="size") Integer size
    ) {
        GoodsReceiptNote grn = grnService.getDetails(grnId);
        if (grn == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Page<GoodsReceiptItem> grnItemsPage = grnItemService.getPageByGrnId(grnId, page, size);
        return ResponseEntity.ok(grnItemsPage);
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, String>> add(
            @RequestPart("data") CreateGrnItemDTO createGrnItemDTO
    ) {
        Map<String, String> responseData = new HashMap<>();
        Integer grnId = createGrnItemDTO.getGrnId();
        GoodsReceiptNote grn = grnService.getDetails(grnId);
        if (grn == null) {
            responseData.put("invalidGrn", "Mã phiếu nhập kho không tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        Product product = productService.getDetails(createGrnItemDTO.getProductId());
        if (product == null) {
            responseData.put("invalidProduct", "Sản phẩm không tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        LocalDate mfgDate = createGrnItemDTO.getMfgDate();
        LocalDate expDate = createGrnItemDTO.getExpDate();

        if (expDate.isBefore(mfgDate) || expDate.isEqual(mfgDate)) {
            responseData.put("expDateErr", "Hạn sử dụng không được nhỏ hơn hoặc bằng ngày sản xuất");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        GoodsReceiptItem grnItem = new GoodsReceiptItem();
        BeanUtils.copyProperties(createGrnItemDTO, grnItem);
        grnItem.setGrn(grn);
        grnItem.setProduct(product);

        try {
            grnItemService.createGrnItem(grnItem);
        }
        catch (Exception e) {
            e.printStackTrace();
            responseData.put("failToCreate", "Có lỗi xảy ra");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        responseData.put("successfulMsg", "Thêm lô hàng vào phiếu nhập kho "+grnId+" thành công");
        return ResponseEntity.ok(responseData);
    }
}

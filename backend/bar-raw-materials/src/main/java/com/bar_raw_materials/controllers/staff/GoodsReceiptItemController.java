package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.goodsReceiptNote.GoodsReceiptNoteService;
import com.bar_raw_materials.services.product.ProductService;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.services.goodsReceiptItem.GoodsReceiptItemService;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.services.batch.BatchService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("${apiStaff}/grnItem")
public class GoodsReceiptItemController extends BaseStaffController {
    GoodsReceiptItemService grnItemService;
    GoodsReceiptNoteService grnService;
    ProductService productService;
    BatchService batchService;

    @Autowired
    public GoodsReceiptItemController(
            GoodsReceiptItemService grnItemService,
            GoodsReceiptNoteService grnService,
            ProductService productService,
            BatchService batchService
    ) {
        super(grnItemService);
        this.grnItemService = grnItemService;
        this.grnService = grnService;
        this.productService = productService;
        this.batchService = batchService;
    }

    @GetMapping("grn/{grnId}/grnItems")
    public ResponseEntity<Page<GrnItemDTO>> getPageByGrnId(
            @PathVariable("grnId") Integer grnId,
            @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
            @Nullable @RequestParam(defaultValue="5", name="size") Integer size
    ) {
        GoodsReceiptNote grn = grnService.getDetails(grnId);
        if (grn == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Page<GrnItemDTO> grnItemsPage = grnItemService.getPageByGrnId(grnId, page, size);
        return ResponseEntity.ok(grnItemsPage);
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, String>> add(
            @RequestPart("data") CreateGrnItemDTO createGrnItemDTO
    ) {
        Map<String, String> responseData = new HashMap<>();
        // Get GoodsReceiptNote by grnId
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

        if (!grnItemService.isValidExpDate(createGrnItemDTO)) {
            responseData.put("expDateErr", "Hạn sử dụng không được nhỏ hơn hoặc bằng ngày sản xuất");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        GoodsReceiptItem grnItem = new GoodsReceiptItem();
        BeanUtils.copyProperties(createGrnItemDTO, grnItem);
        // GrnId of a GrnItem is fixed once creation
        grnItem.setGrn(grn);
        grnItem.setProduct(product);

        try {
            grnItemService.createGrnItem(grnItem, createGrnItemDTO);
        }
        catch (Exception e) {
            e.printStackTrace();
            responseData.put("failToCreate", "Có lỗi xảy ra");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        responseData.put("successfulMsg", "Thêm lô hàng vào phiếu nhập kho "+grnId+" thành công");
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("update/{grnItemId}")
    public ResponseEntity<Map<String, String>> update(
            @PathVariable("grnItemId") Integer grnItemId,
            @RequestPart("data") CreateGrnItemDTO updateGrnItemDTO
    ) {
        Map<String, String> responseData = new HashMap<>();
        GoodsReceiptItem grnItem = grnItemService.getDetails(grnItemId);
        if (grnItem == null) {
            responseData.put("invalidGrnItem", "Lô hàng nhập kho không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!grnItemService.isValidExpDate(updateGrnItemDTO)) {
            responseData.put("expDateErr", "Hạn sử dụng không được nhỏ hơn hoặc bằng ngày sản xuất");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        BeanUtils.copyProperties(updateGrnItemDTO, grnItem);

        int currentProductId = grnItem.getProduct().getId();
        int updateProductId = updateGrnItemDTO.getProductId();
        // if new product is updated
        if (currentProductId != updateProductId) {
            Product product = productService.getDetails(updateProductId);
            if (product == null) {
                responseData.put("invalidProduct", "Sản phẩm không tồn tại");
                return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
            }
            // set new product to grnItem
            grnItem.setProduct(product);
        }

        try {
            grnItemService.updateGrnItem(grnItem, updateGrnItemDTO);
        }
        catch (Exception e) {
            e.printStackTrace();
            responseData.put("failToCreate", "Có lỗi xảy ra");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        responseData.put("successfulMsg", "Lô hàng nhập kho được cập nhật thành công");
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("delete/{grnItemId}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable("grnItemId") Integer grnItemId
    ) {
        GoodsReceiptItem grnItem = grnItemService.getDetails(grnItemId);
        if (grnItem == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Map<String, String> responseData = new HashMap<>();
        try {
            grnItemService.deleteGrnItem(grnItem);
        }
        catch (Exception e) {
            e.printStackTrace();
            responseData.put("failToDelete", "Có lỗi xảy ra");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        responseData.put("successfulMsg", "Đơn hàng nhập kho sản phẩm "+grnItem.getProduct().getName()+" được xóa thành công");
        return ResponseEntity.ok(responseData);
    }
}

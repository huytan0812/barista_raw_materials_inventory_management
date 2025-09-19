package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.goodsReceiptItem.GoodsReceiptItemService;
import com.bar_raw_materials.services.productInventory.ProductInventoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.services.goodsReceiptNote.GoodsReceiptNoteService;
import com.bar_raw_materials.utils.ImageUtils;
import com.bar_raw_materials.utils.AuthUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${apiStaff}/grn")
public class GoodsReceiptNoteController extends BaseStaffController{
    GoodsReceiptNoteService goodsReceiptNoteService;
    GoodsReceiptItemService grnItemService;
    ImageUtils imageUtils;
    AuthUtils authUtils;

    @Autowired
    public GoodsReceiptNoteController(
                GoodsReceiptNoteService goodsReceiptNoteService,
                GoodsReceiptItemService grnItemService,
                ImageUtils imageUtils,
                AuthUtils authUtils
            ) {
        super(goodsReceiptNoteService);
        this.goodsReceiptNoteService = goodsReceiptNoteService;
        this.grnItemService = grnItemService;
        this.imageUtils = imageUtils;
        this.authUtils = authUtils;
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, String>> add(
            @RequestPart("data") CreateGrnDTO createGrnDTO,
            @Nullable @RequestPart("image") MultipartFile image
    ) {
        Map<String, String> responseData = new HashMap<>();
        User currentAuthorizedUser = authUtils.getCurrentAuthorizedUser();
        if (currentAuthorizedUser == null) {
            responseData.put("errorMsg", "User không tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        createGrnDTO.setCreatedBy(currentAuthorizedUser);

        if (image != null) {
            String imageName = imageUtils.upload(image, "vendor");
            createGrnDTO.setInvoiceImage(imageName);
        }

        if (goodsReceiptNoteService.isDuplicateInvoiceNumber(createGrnDTO.getInvoiceNumber())) {
            responseData.put("duplicateInvoiceNumber", "Số hóa đơn đã tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        GoodsReceiptNote savedGrn = new GoodsReceiptNote();
        try {
            savedGrn = goodsReceiptNoteService.createGrn(createGrnDTO);
        }
        catch (Exception e) {
            e.printStackTrace();
            responseData.put("errorMsg", "Có lỗi xảy ra");
            return ResponseEntity.badRequest().body(responseData);
        }

        responseData.put("successfulMsg", "Phiếu nhập kho đã được tạo thành công");
        responseData.put("grnId", savedGrn.getId().toString());
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("update/{id}")
    public ResponseEntity<CreateGrnDTO> update(
            @PathVariable("id") Integer id
    ) {
        GoodsReceiptNote goodsReceiptNote = goodsReceiptNoteService.getDetails(id);
        if (goodsReceiptNote == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        CreateGrnDTO createGrnDTO = new CreateGrnDTO();
        BeanUtils.copyProperties(goodsReceiptNote, createGrnDTO);

        return ResponseEntity.ok(createGrnDTO);
    }

    @PostMapping("update/{id}")
    public ResponseEntity<Map<String, String>> update(
            @PathVariable("id") Integer id,
            @RequestPart("data") CreateGrnDTO createGrnDTO,
            @Nullable @RequestPart("image") MultipartFile image
    ) {
        GoodsReceiptNote grn = goodsReceiptNoteService.getDetails(id);
        if (grn == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        createGrnDTO.setId(id);
        createGrnDTO.setCreatedBy(grn.getCreatedBy());

        if (!createGrnDTO.getInvoiceNumber().equals(grn.getInvoiceNumber())
            && goodsReceiptNoteService.isDuplicateInvoiceNumber(createGrnDTO.getInvoiceNumber())
        ) {
            Map<String, String> responseData = new HashMap<>();
            responseData.put("duplicateInvoiceNumber", "Số hóa đơn không được trùng");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        // if new image was uploaded
        if (image != null) {
            String imageName = imageUtils.upload(image, "vendor");
            createGrnDTO.setInvoiceImage(imageName);
        }

        try {
            goodsReceiptNoteService.update(grn, createGrnDTO);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("confirm/{id}")
    public ResponseEntity<String> confirm(
            @PathVariable("id") Integer id
    ) {
        GoodsReceiptNote grn = goodsReceiptNoteService.getDetails(id);
        if (grn == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // get all light grn items dto
        List<LightGrnItemDTO> grnItems = grnItemService.getAllLightGrnItems(id);
        try {
            goodsReceiptNoteService.confirm(grn, grnItems);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Phê duyệt thành công");
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<String> delete(
            @PathVariable("id") Integer id
    ) {
        GoodsReceiptNote grn = goodsReceiptNoteService.getDetails(id);
        if (grn == null) {
            return new ResponseEntity<>("Không tìm thấy phiếu nhập kho", HttpStatus.NOT_FOUND);
        }

        try {
            goodsReceiptNoteService.delete(grn);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Có lỗi xảy ra", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Phiếu nhập kho "+id+" được xóa thành công");
    }
}

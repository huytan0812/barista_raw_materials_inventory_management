package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.services.goodsReceiptNote.GoodsReceiptNoteService;
import com.bar_raw_materials.utils.ImageUtils;
import com.bar_raw_materials.utils.AuthUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${apiStaff}/grn")
public class GoodsReceiptNoteController extends BaseStaffController{
    GoodsReceiptNoteService goodsReceiptNoteService;
    ImageUtils imageUtils;
    AuthUtils authUtils;

    @Autowired
    public GoodsReceiptNoteController(
                GoodsReceiptNoteService goodsReceiptNoteService,
                ImageUtils imageUtils,
                AuthUtils authUtils
            ) {
        super(goodsReceiptNoteService);
        this.goodsReceiptNoteService = goodsReceiptNoteService;
        this.imageUtils = imageUtils;
        this.authUtils = authUtils;
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, String>> add(
            @RequestPart("data") CreateGrnDTO createGrnDTO,
            @RequestPart("image") MultipartFile image
    ) {
        Map<String, String> responseData = new HashMap<>();
        User currentAuthorizedUser = authUtils.getCurrentAuthorizedUser();
        if (currentAuthorizedUser == null) {
            responseData.put("errorMsg", "User không tồn tại");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }

        createGrnDTO.setCreatedBy(currentAuthorizedUser);

        String imageName = imageUtils.upload(image, "vendor");
        createGrnDTO.setInvoiceImage(imageName);

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
}

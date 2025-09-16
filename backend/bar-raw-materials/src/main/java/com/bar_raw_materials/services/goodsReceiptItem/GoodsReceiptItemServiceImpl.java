package com.bar_raw_materials.services.goodsReceiptItem;

import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.services.batch.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class GoodsReceiptItemServiceImpl implements GoodsReceiptItemService {
    private final GoodsReceiptItemRepository goodsReceiptItemRepository;
    private final BatchService batchService;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<?> getPage(int page, int size) {
        return null;
    }

    @Override
    public GoodsReceiptItem getDetails(int id) {
        return goodsReceiptItemRepository.findById(id);
    }

    @Override
    public Page<GrnItemDTO> getPageByGrnId(
            Integer grnId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return goodsReceiptItemRepository.getPageByGrnId(grnId, pageable);
    }

    @Override
    public List<GoodsReceiptItem> getAllByGrnId(Integer grnId) {
        return goodsReceiptItemRepository.getAllGrnItemsByGrnId(grnId);
    }

    @Override
    public List<Integer> getAllIdsByGrnId(Integer grnId) {
        return goodsReceiptItemRepository.getAllGrnItemIdsByGrnId(grnId);
    }

    @Override
    @Transactional
    public void createGrnItem(GoodsReceiptItem grnItem, CreateGrnItemDTO createGrnItemDTO) {
        Batch batch = batchService.getBatchByLotNumber(createGrnItemDTO.getLotNumber());
        if (batch == null) {
            Batch newBatch = new Batch();
            newBatch.setLotNumber(createGrnItemDTO.getLotNumber());
            newBatch.setProduct(grnItem.getProduct());
            newBatch.setMfgDate(createGrnItemDTO.getMfgDate());
            newBatch.setExpDate(createGrnItemDTO.getExpDate());
            batchService.createBatch(newBatch);
            batch = newBatch;
        }
        grnItem.setBatch(batch);
        goodsReceiptItemRepository.save(grnItem);
    }

    @Override
    public void updateGrnItem(GoodsReceiptItem grnItem) {
        goodsReceiptItemRepository.save(grnItem);
    }

    @Override
    public void deleteGrnItem(GoodsReceiptItem grnItem) {
        goodsReceiptItemRepository.delete(grnItem);
    }

    @Override
    public Boolean isValidExpDate(CreateGrnItemDTO createGrnItemDTO) {
        LocalDate mfgDate = createGrnItemDTO.getMfgDate();
        LocalDate expDate = createGrnItemDTO.getExpDate();

        return !expDate.isBefore(mfgDate) && !expDate.isEqual(mfgDate);
    }
}

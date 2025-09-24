package com.bar_raw_materials.services.goodsReceiptItem;

import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemForExportingDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.entities.GoodsReceiptNote;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.services.batch.BatchService;
import com.bar_raw_materials.services.product.ProductService;
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
    private final ProductService productService;

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
    public List<LightGrnItemDTO> getAllLightGrnItems(Integer grnId) {
        return goodsReceiptItemRepository.getLightGrnItemsByGrnId(grnId);
    }

    @Override
    public List<GrnItemForExportingDTO> getGrnItemsForExporting(Integer productId) {
        return goodsReceiptItemRepository.findGrnItemForExportingByProductId(productId);
    }

    @Override
    @Transactional
    public void createGrnItem(GoodsReceiptItem grnItem, CreateGrnItemDTO createGrnItemDTO) {
        Batch batch = batchService.getBatchByLotNumber(createGrnItemDTO.getLotNumber());
        if (batch == null) {
            batch = batchService.createBatchByGrnItemDTO(createGrnItemDTO, grnItem.getProduct());
        }
        grnItem.setBatch(batch);
        grnItem.setQuantityRemain(grnItem.getQuantityImport());
        goodsReceiptItemRepository.save(grnItem);
    }

    @Override
    @Transactional
    public void updateGrnItem(GoodsReceiptItem grnItem, CreateGrnItemDTO updateGrnItemDTO) {
        String preLotNumber = grnItem.getBatch().getLotNumber();
        String updatedLotNumber = updateGrnItemDTO.getLotNumber();
        // if new batch is updated
        if (!preLotNumber.equals(updatedLotNumber)) {
            Batch batch = batchService.getBatchByLotNumber(updatedLotNumber);
            if (batch == null) {
                batch = batchService.createBatchByGrnItemDTO(updateGrnItemDTO, grnItem.getProduct());
            }
            grnItem.setBatch(batch);
        }
        grnItem.setQuantityRemain(grnItem.getQuantityImport());
        goodsReceiptItemRepository.save(grnItem);
    }

    @Override
    public void deleteGrnItem(GoodsReceiptItem grnItem) {
        goodsReceiptItemRepository.delete(grnItem);
    }

    @Override
    public Integer getQuantityRemain(Integer id) {
        return goodsReceiptItemRepository.getQuantityRemainByGrnItemId(id);
    }

    @Override
    public Boolean isValidExpDate(CreateGrnItemDTO createGrnItemDTO) {
        LocalDate mfgDate = createGrnItemDTO.getMfgDate();
        LocalDate expDate = createGrnItemDTO.getExpDate();

        return !expDate.isBefore(mfgDate) && !expDate.isEqual(mfgDate);
    }
}

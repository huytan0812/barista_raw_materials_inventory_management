package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.dto.batch.BatchDTO;
import com.bar_raw_materials.dto.batch.LightBatchDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BatchService extends EntityService {
    List<Batch> getAll();
    List<LightBatchDTO> getAllLight();
    Batch getBatchByLotNumber(String lotNumber);
    Batch createBatchByGrnItemDTO(CreateGrnItemDTO grnItemDTO, Product product);
    Page<BatchDTO> searchAndSort(String productName, String sort, int page, int size);
    Page<BatchDTO> searchByProductName(String productName, int page, int size);
    Page<BatchDTO> sortByQuantityRemain(String sort, int page, int size);
    Page<BatchDTO> filterByExpDate(String filter, int page, int size);
    void createBatch(Batch batch);
}

package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.dto.batch.LightBatchDTO;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import java.util.List;

public interface BatchService extends EntityService {
    List<Batch> getAll();
    List<LightBatchDTO> getAllLight();
    Batch getBatchByLotNumber(String lotNumber);
    void createBatch(Batch batch);
    Batch createBatchByGrnItemDTO(CreateGrnItemDTO grnItemDTO, Product product);
}

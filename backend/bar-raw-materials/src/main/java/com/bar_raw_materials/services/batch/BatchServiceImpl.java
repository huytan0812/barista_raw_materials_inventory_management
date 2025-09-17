package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.dto.batch.LightBatchDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.repositories.BatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {
    private final BatchRepository batchRepository;

    @Override
    public List<Batch> getAll() {
        return batchRepository.findAllAlongProduct();
    }

    @Override
    public List<LightBatchDTO> getAllLight() {
        return batchRepository.getAllLightBatchDTO();
    }

    @Override
    public Page<?> getPage(int page, int size) {
        return null;
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }

    @Override
    public Batch getBatchByLotNumber(String lotNumber) {
        return batchRepository.findByLotNumber(lotNumber);
    }

    @Override
    public void createBatch(Batch batch) {
        batchRepository.save(batch);
    }

    @Override
    public Batch createBatchByGrnItemDTO(CreateGrnItemDTO grnItemDTO, Product product) {
        Batch newBatch = new Batch();
        newBatch.setLotNumber(grnItemDTO.getLotNumber());
        newBatch.setProduct(product);
        newBatch.setMfgDate(grnItemDTO.getMfgDate());
        newBatch.setExpDate(grnItemDTO.getExpDate());
        batchRepository.save(newBatch);
        return newBatch;
    }
}

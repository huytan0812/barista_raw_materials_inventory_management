package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.dto.batch.LightBatchDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.repositories.BatchRepository;
import com.bar_raw_materials.dto.batch.BatchDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<BatchDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("expDate").ascending());
        return batchRepository.pagination(pageable);
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

    @Override
    public Page<BatchDTO> searchAndSort(String productName, String sort, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("quantityRemain").descending());
        if (sort.equals("asc")) pageable = PageRequest.of(page, size, Sort.by("quantityRemain").ascending());
        return batchRepository.findByProductName(pageable, productName);
    }

    @Override
    public Page<BatchDTO> searchByProductName(
            String productName,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("expDate").ascending());
        return batchRepository.findByProductName(pageable, productName);
    }

    @Override
    public Page<BatchDTO> sortByQuantityRemain(String sort, int page, int size) {
        // sort by quantity remain DESC by default
        Pageable pageable = PageRequest.of(page, size, Sort.by("quantityRemain").descending());
        if (sort.equals("asc")) pageable = PageRequest.of(page, size, Sort.by("quantityRemain").ascending());
        return batchRepository.sortByQuantityRemain(pageable);
    }

    @Override
    public Page<BatchDTO> filterByExpDate(String filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("expDate").ascending());
        return switch (filter) {
            case "expired" -> batchRepository.findExpiredBatch(pageable);
            case "aboutToExpire" -> batchRepository.findAboutToExpireBatch(pageable);
            case "valid" -> batchRepository.findValidBatch(pageable);
            default -> batchRepository.pagination(pageable);
        };
    }
}

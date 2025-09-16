package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.entities.Batch;
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
}

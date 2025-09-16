package com.bar_raw_materials.services.batch;

import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.Batch;

import java.util.List;

public interface BatchService extends EntityService {
    List<Batch> getAll();
    Batch getBatchByLotNumber(String lotNumber);
    void createBatch(Batch batch);
}

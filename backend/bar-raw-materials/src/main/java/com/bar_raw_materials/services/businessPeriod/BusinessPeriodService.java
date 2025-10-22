package com.bar_raw_materials.services.businessPeriod;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.services.EntityService;

import java.util.List;

public interface BusinessPeriodService extends EntityService {
    BusinessPeriod getCurrent();
    BusinessPeriod createPeriod();
    List<ProductInventory> getAllCurrentPeriodProductINVs();
    void createPeriodWithProductInventories();
    void endOfPeriod();
}

package com.bar_raw_materials.services.businessPeriod;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.services.EntityService;

public interface BusinessPeriodService extends EntityService {
    BusinessPeriod getCurrent();
    void create();
}

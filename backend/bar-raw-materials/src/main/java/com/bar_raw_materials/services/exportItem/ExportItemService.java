package com.bar_raw_materials.services.exportItem;

import com.bar_raw_materials.dto.exportItem.CreateExportItemDTO;
import com.bar_raw_materials.dto.exportItem.ExportItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import com.bar_raw_materials.services.EntityService;

import java.util.List;

public interface ExportItemService extends EntityService {
    ExportItemDetail create(CreateExportItemDTO createExportItemDTO);
    List<ExportItemDetail> getBySalesOrderItemId(int id);
    List<ExportItemDTO> getExportItemBySalesItemId(int id);
    void update(int id, int quantityTake);
    void delete(int id);
    void deleteCancelExpItems(List<Integer> expItemIdList);
}

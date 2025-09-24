package com.bar_raw_materials.services.goodsReceiptItem;

import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.GrnItemForExportingDTO;
import com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;
import java.util.List;

public interface GoodsReceiptItemService extends EntityService {
    // get page of Grn items per Grn
    Page<GrnItemDTO> getPageByGrnId(
            Integer grnId,
            int page,
            int size
    );

    // get all Grn items per Grn
    List<GoodsReceiptItem> getAllByGrnId(Integer grnId);

    // get all light grn items dto per GRN
    List<LightGrnItemDTO> getAllLightGrnItems(Integer grnId);

    // get all grn items dto by product id for exporting
    List<GrnItemForExportingDTO> getGrnItemsForExporting(Integer productId);

    void createGrnItem(GoodsReceiptItem grnItem, CreateGrnItemDTO createGrnItemDTO);
    void updateGrnItem(GoodsReceiptItem grnItem, CreateGrnItemDTO updateGrnItemDTO);
    void deleteGrnItem(GoodsReceiptItem grnItem);

    // util service
    Boolean isValidExpDate(CreateGrnItemDTO createGrnItemDTO);
}

package com.bar_raw_materials.services.goodsReceiptItem;

import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.services.EntityService;
import org.springframework.data.domain.Page;
import java.time.LocalDate;

public interface GoodsReceiptItemService extends EntityService {
    // get all Grn items per Grn
    Page<GoodsReceiptItem> getPageByGrnId(
            Integer grnId,
            int page,
            int size
    );
    void createGrnItem(GoodsReceiptItem grnItem);
    void updateGrnItem(GoodsReceiptItem grnItem);
    void deleteGrnItem(GoodsReceiptItem grnItem);

    // util service
    Boolean isValidExpDate(CreateGrnItemDTO createGrnItemDTO);
}

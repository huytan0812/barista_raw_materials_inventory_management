package com.bar_raw_materials.services.exportItem;

import com.bar_raw_materials.dto.exportItem.CreateExportItemDTO;
import com.bar_raw_materials.dto.exportItem.ExportItemDTO;
import com.bar_raw_materials.entities.ExportItemDetail;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.exceptions.exportItem.ExceedQuantityRemainException;
import com.bar_raw_materials.exceptions.exportItem.ExportItemDetailDoesNotExistException;
import com.bar_raw_materials.exceptions.grnItem.GoodsReceiptItemDoesNotExistException;
import com.bar_raw_materials.exceptions.salesItem.SalesOrderItemDoesNotExistException;
import com.bar_raw_materials.repositories.ExportItemDetailRepository;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.services.goodsReceiptItem.GoodsReceiptItemService;
import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportEntityServiceImpl implements ExportItemService{
    private final ExportItemDetailRepository exportItemDetailRepository;
    private final GoodsReceiptItemRepository grnItemRepository;
    private final GoodsReceiptItemService grnItemService;
    private final SalesOrderItemService salesItemService;

    @Override
    public List<?> getAll() {
        return List.of();
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
    @Transactional
    public ExportItemDetail create(CreateExportItemDTO createExportItemDTO) {
        int grnItemId = createExportItemDTO.getGrnItemId();
        GoodsReceiptItem grnItem = grnItemService.getDetails(grnItemId);
        if (grnItem == null) {
            throw new GoodsReceiptItemDoesNotExistException("Lô hàng nhập kho không tồn tại");
        }

        int salesOrderId = createExportItemDTO.getSalesItemId();
        SalesOrderItem salesOrderItem = salesItemService.getDetails(salesOrderId);
        if (salesOrderItem == null) {
            throw new SalesOrderItemDoesNotExistException("Đơn hàng bán không tồn tại");
        }

        int quantityRemain = grnItem.getQuantityRemain();
        if (createExportItemDTO.getQuantityTake() > quantityRemain) {
            throw new ExceedQuantityRemainException("Số lượng lấy ra không được phép vượt quá SLCL");
        }
        // subtract quantity remain in GrnItem and update
        grnItem.setQuantityRemain(grnItem.getQuantityRemain() - createExportItemDTO.getQuantityTake());
        grnItemRepository.save(grnItem);

        ExportItemDetail exportItemDetail = new ExportItemDetail();
        exportItemDetail.setGrnItem(grnItem);
        exportItemDetail.setOrderItem(salesOrderItem);
        exportItemDetail.setQuantityTake(createExportItemDTO.getQuantityTake());
        exportItemDetail.setLotNumber(grnItem.getBatch().getLotNumber());
        exportItemDetail.setUnitCost(grnItem.getUnitCost());
        return exportItemDetailRepository.save(exportItemDetail);
    }

    // used for deleting in SalesOrderItemService
    @Override
    public List<ExportItemDetail> getBySalesOrderItemId(int id) {
        return exportItemDetailRepository.findBySalesOrderItemId(id);
    }

    @Override
    public List<ExportItemDTO> getExportItemBySalesItemId(int id) {
        return exportItemDetailRepository.findExpItemDTOBySalesItemId(id);
    }

    @Override
    @Transactional
    public void delete(int id) {
        ExportItemDetail expItem = exportItemDetailRepository.findById(id);
        if (expItem == null) {
            throw new ExportItemDetailDoesNotExistException("Chi tiết đơn hàng bán không tồn tại");
        }
        // return the quantity take to the quantity remain
        GoodsReceiptItem grnItem = expItem.getGrnItem();
        grnItem.setQuantityRemain(grnItem.getQuantityRemain() + expItem.getQuantityTake());
        grnItemRepository.save(grnItem);
        exportItemDetailRepository.delete(expItem);
    }
}

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
import com.bar_raw_materials.repositories.SalesOrderItemRepository;

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
    private final SalesOrderItemRepository salesItemRepository;
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

        int salesItemId = createExportItemDTO.getSalesItemId();
        SalesOrderItem salesOrderItem = salesItemService.getDetails(salesItemId);
        if (salesOrderItem == null) {
            throw new SalesOrderItemDoesNotExistException("Đơn hàng bán không tồn tại");
        }

        int quantityRemain = grnItem.getQuantityRemain();
        if (createExportItemDTO.getQuantityTake() > quantityRemain) {
            throw new ExceedQuantityRemainException("Số lượng lấy ra không được phép vượt quá SLCL");
        }
        // add the quantityTake to the quantitySold in the salesOrderItem
        salesOrderItem.setQuantitySold(salesOrderItem.getQuantitySold() + createExportItemDTO.getQuantityTake());
        salesItemRepository.save(salesOrderItem);

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
    public void update(int id, int quantityTake) {
        ExportItemDetail expItem = exportItemDetailRepository.findById(id);
        if (expItem == null) {
            throw new ExportItemDetailDoesNotExistException("Chi tiết hàng bán không tồn tại");
        }
        SalesOrderItem salesItem = expItem.getOrderItem();
        salesItem.setQuantitySold(salesItem.getQuantitySold() - expItem.getQuantityTake() + quantityTake);
        salesItemRepository.save(salesItem);

        GoodsReceiptItem grnItem = expItem.getGrnItem();
        grnItem.setQuantityRemain(grnItem.getQuantityRemain() + expItem.getQuantityTake() - quantityTake);
        grnItemRepository.save(grnItem);

        expItem.setQuantityTake(quantityTake);
        exportItemDetailRepository.save(expItem);
    }

    @Override
    @Transactional
    public void delete(int id) {
        ExportItemDetail expItem = exportItemDetailRepository.findById(id);
        if (expItem == null) {
            throw new ExportItemDetailDoesNotExistException("Chi tiết đơn hàng bán không tồn tại");
        }
        SalesOrderItem salesItem = expItem.getOrderItem();
        salesItem.setQuantitySold(salesItem.getQuantitySold() - expItem.getQuantityTake());
        salesItemRepository.save(salesItem);

        // return the quantity take to the quantity remain
        GoodsReceiptItem grnItem = expItem.getGrnItem();
        grnItem.setQuantityRemain(grnItem.getQuantityRemain() + expItem.getQuantityTake());
        grnItemRepository.save(grnItem);

        exportItemDetailRepository.delete(expItem);
    }

    @Override
    @Transactional
    public void deleteCancelExpItems(List<Integer> expItemIdList) {
        List<ExportItemDetail> expItems = exportItemDetailRepository.findByListOfIds(expItemIdList);
        Integer totalQuantityTake = 0;
        SalesOrderItem salesOrderItem = expItems.getFirst().getOrderItem();
        for (ExportItemDetail expItem : expItems) {
            totalQuantityTake += expItem.getQuantityTake();
            GoodsReceiptItem grnItem = expItem.getGrnItem();
            grnItem.setQuantityRemain(grnItem.getQuantityRemain() + expItem.getQuantityTake());
            grnItemRepository.save(grnItem);
        }
        if (salesOrderItem != null) {
            salesOrderItem.setQuantitySold(salesOrderItem.getQuantitySold() - totalQuantityTake);
            salesItemRepository.save(salesOrderItem);
        }
        exportItemDetailRepository.deleteAll(expItems);
    }
}

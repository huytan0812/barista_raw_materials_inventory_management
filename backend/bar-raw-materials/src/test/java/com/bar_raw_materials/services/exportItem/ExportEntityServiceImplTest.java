package com.bar_raw_materials.services.exportItem;

import com.bar_raw_materials.dto.exportItem.CreateExportItemDTO;
import com.bar_raw_materials.entities.Batch;
import com.bar_raw_materials.entities.ExportItemDetail;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.entities.SalesOrderItem;
import com.bar_raw_materials.exceptions.exportItem.ExceedQuantityRemainException;
import com.bar_raw_materials.repositories.ExportItemDetailRepository;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import com.bar_raw_materials.repositories.SalesOrderItemRepository;
import com.bar_raw_materials.services.goodsReceiptItem.GoodsReceiptItemService;
import com.bar_raw_materials.services.salesOrderItem.SalesOrderItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExportEntityServiceImplTest {
    @Mock
    private ExportItemDetailRepository exportItemDetailRepository;
    @Mock
    private GoodsReceiptItemRepository grnItemRepository;
    @Mock
    private SalesOrderItemRepository salesItemRepository;
    @Mock
    private GoodsReceiptItemService grnItemService;
    @Mock
    private SalesOrderItemService salesItemService;

    @InjectMocks
    private ExportEntityServiceImpl exportService;

    @Test
    void createTakesQuantityFromLotAndAddsCogsToSalesItem() {
        GoodsReceiptItem grnItem = grnItem(1, 10, "12.50", "LOT-A");
        SalesOrderItem salesItem = salesItem(7, 0, null);
        when(grnItemService.getDetails(1)).thenReturn(grnItem);
        when(salesItemService.getDetails(7)).thenReturn(salesItem);
        when(exportItemDetailRepository.save(any(ExportItemDetail.class))).thenAnswer(inv -> inv.getArgument(0));

        ExportItemDetail created = exportService.create(new CreateExportItemDTO(1, 4, 7));

        assertThat(grnItem.getQuantityRemain()).isEqualTo(6);
        assertThat(salesItem.getQuantitySold()).isEqualTo(4);
        assertThat(salesItem.getCogs()).isEqualByComparingTo("50.00");
        assertThat(created.getQuantityTake()).isEqualTo(4);
        assertThat(created.getUnitCost()).isEqualByComparingTo("12.50");
        assertThat(created.getLotNumber()).isEqualTo("LOT-A");
        assertThat(created.getGrnItem()).isSameAs(grnItem);
        assertThat(created.getOrderItem()).isSameAs(salesItem);
        verify(salesItemRepository).save(salesItem);
        verify(grnItemRepository).saveAndFlush(grnItem);
    }

    @Test
    void createAddsToExistingCogsOfSalesItem() {
        GoodsReceiptItem grnItem = grnItem(2, 5, "20.00", "LOT-B");
        // the sales item already took 3 units from another lot at 12.50
        SalesOrderItem salesItem = salesItem(7, 3, "37.50");
        when(grnItemService.getDetails(2)).thenReturn(grnItem);
        when(salesItemService.getDetails(7)).thenReturn(salesItem);
        when(exportItemDetailRepository.save(any(ExportItemDetail.class))).thenAnswer(inv -> inv.getArgument(0));

        exportService.create(new CreateExportItemDTO(2, 5, 7));

        assertThat(grnItem.getQuantityRemain()).isZero();
        assertThat(salesItem.getQuantitySold()).isEqualTo(8);
        assertThat(salesItem.getCogs()).isEqualByComparingTo("137.50");
    }

    @Test
    void createRejectsQuantityAboveRemaining() {
        GoodsReceiptItem grnItem = grnItem(1, 10, "12.50", "LOT-A");
        SalesOrderItem salesItem = salesItem(7, 0, null);
        when(grnItemService.getDetails(1)).thenReturn(grnItem);
        when(salesItemService.getDetails(7)).thenReturn(salesItem);

        assertThatThrownBy(() -> exportService.create(new CreateExportItemDTO(1, 11, 7)))
                .isInstanceOf(ExceedQuantityRemainException.class);

        assertThat(grnItem.getQuantityRemain()).isEqualTo(10);
        assertThat(salesItem.getQuantitySold()).isZero();
        assertThat(salesItem.getCogs()).isNull();
        verify(grnItemRepository, never()).saveAndFlush(any());
        verify(salesItemRepository, never()).save(any());
        verify(exportItemDetailRepository, never()).save(any());
    }

    @Test
    void updateIncreasingQuantityTakesMoreFromLotAndAdjustsCogs() {
        // state after taking 4 units at 12.50 from a lot of 10
        GoodsReceiptItem grnItem = grnItem(1, 6, "12.50", "LOT-A");
        SalesOrderItem salesItem = salesItem(7, 4, "50.00");
        ExportItemDetail expItem = exportItem(100, grnItem, salesItem, 4);
        when(exportItemDetailRepository.findById(100)).thenReturn(expItem);

        exportService.update(100, 7);

        assertThat(grnItem.getQuantityRemain()).isEqualTo(3);
        assertThat(salesItem.getQuantitySold()).isEqualTo(7);
        assertThat(salesItem.getCogs()).isEqualByComparingTo("87.50");
        assertThat(expItem.getQuantityTake()).isEqualTo(7);
        verify(grnItemRepository).save(grnItem);
        verify(salesItemRepository).save(salesItem);
        verify(exportItemDetailRepository).save(expItem);
    }

    @Test
    void updateDecreasingQuantityRestoresStockAndCogs() {
        GoodsReceiptItem grnItem = grnItem(1, 6, "12.50", "LOT-A");
        SalesOrderItem salesItem = salesItem(7, 4, "50.00");
        ExportItemDetail expItem = exportItem(100, grnItem, salesItem, 4);
        when(exportItemDetailRepository.findById(100)).thenReturn(expItem);

        exportService.update(100, 1);

        assertThat(grnItem.getQuantityRemain()).isEqualTo(9);
        assertThat(salesItem.getQuantitySold()).isEqualTo(1);
        assertThat(salesItem.getCogs()).isEqualByComparingTo("12.50");
        assertThat(expItem.getQuantityTake()).isEqualTo(1);
    }

    @Test
    void deleteRestoresStockQuantitySoldAndCogs() {
        GoodsReceiptItem grnItem = grnItem(1, 6, "12.50", "LOT-A");
        SalesOrderItem salesItem = salesItem(7, 4, "50.00");
        ExportItemDetail expItem = exportItem(100, grnItem, salesItem, 4);
        when(exportItemDetailRepository.findById(100)).thenReturn(expItem);

        exportService.delete(100);

        assertThat(grnItem.getQuantityRemain()).isEqualTo(10);
        assertThat(salesItem.getQuantitySold()).isZero();
        assertThat(salesItem.getCogs()).isEqualByComparingTo("0");
        verify(grnItemRepository).save(grnItem);
        verify(salesItemRepository).save(salesItem);
        verify(exportItemDetailRepository).delete(expItem);
    }

    @Test
    void deleteCancelExpItemsRestoresEveryLotAndTheSalesItem() {
        // sales item took 4 @ 12.50 from lot A and 2 @ 20.00 from lot B, on top of 1 @ 10.00 kept from before
        GoodsReceiptItem lotA = grnItem(1, 6, "12.50", "LOT-A");
        GoodsReceiptItem lotB = grnItem(2, 3, "20.00", "LOT-B");
        SalesOrderItem salesItem = salesItem(7, 7, "100.00");
        ExportItemDetail expA = exportItem(100, lotA, salesItem, 4);
        ExportItemDetail expB = exportItem(101, lotB, salesItem, 2);
        List<ExportItemDetail> expItems = List.of(expA, expB);
        when(exportItemDetailRepository.findByListOfIds(List.of(100, 101))).thenReturn(expItems);

        exportService.deleteCancelExpItems(List.of(100, 101));

        assertThat(lotA.getQuantityRemain()).isEqualTo(10);
        assertThat(lotB.getQuantityRemain()).isEqualTo(5);
        assertThat(salesItem.getQuantitySold()).isEqualTo(1);
        assertThat(salesItem.getCogs()).isEqualByComparingTo("10.00");
        verify(grnItemRepository).save(lotA);
        verify(grnItemRepository).save(lotB);
        verify(salesItemRepository).save(salesItem);
        verify(exportItemDetailRepository).deleteAll(expItems);
    }

    private static GoodsReceiptItem grnItem(int id, int quantityRemain, String unitCost, String lotNumber) {
        Batch batch = new Batch();
        batch.setLotNumber(lotNumber);
        GoodsReceiptItem grnItem = new GoodsReceiptItem();
        grnItem.setId(id);
        grnItem.setQuantityRemain(quantityRemain);
        grnItem.setUnitCost(new BigDecimal(unitCost));
        grnItem.setBatch(batch);
        return grnItem;
    }

    private static SalesOrderItem salesItem(int id, int quantitySold, String cogs) {
        SalesOrderItem salesItem = new SalesOrderItem();
        salesItem.setId(id);
        salesItem.setQuantitySold(quantitySold);
        salesItem.setCogs(cogs == null ? null : new BigDecimal(cogs));
        return salesItem;
    }

    private static ExportItemDetail exportItem(
            int id, GoodsReceiptItem grnItem, SalesOrderItem salesItem, int quantityTake
    ) {
        ExportItemDetail expItem = new ExportItemDetail();
        expItem.setId(id);
        expItem.setGrnItem(grnItem);
        expItem.setOrderItem(salesItem);
        expItem.setQuantityTake(quantityTake);
        expItem.setUnitCost(grnItem.getUnitCost());
        expItem.setLotNumber(grnItem.getBatch().getLotNumber());
        return expItem;
    }
}

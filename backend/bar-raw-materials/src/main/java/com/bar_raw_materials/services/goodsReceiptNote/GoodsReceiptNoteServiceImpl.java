package com.bar_raw_materials.services.goodsReceiptNote;

import com.bar_raw_materials.dto.goodsReceiptItem.LightGrnItemDTO;
import com.bar_raw_materials.dto.goodsReceiptNote.CreateGrnDTO;
import com.bar_raw_materials.dto.goodsReceiptNote.GrnDTO;
import com.bar_raw_materials.dto.productInventory.ImportValueDTO;
import com.bar_raw_materials.entities.*;
import com.bar_raw_materials.repositories.GoodsReceiptNoteRepository;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import com.bar_raw_materials.repositories.VendorRepository;
import com.bar_raw_materials.repositories.BusinessPeriodRepository;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GoodsReceiptNoteServiceImpl implements GoodsReceiptNoteService {
    private final GoodsReceiptNoteRepository goodsReceiptNoteRepository;
    private final VendorRepository vendorRepository;
    private final BusinessPeriodRepository businessPeriodRepository;
    private final ProductInventoryRepository productInventoryRepository;
    private final GoodsReceiptItemRepository grnItemRepository;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<GrnDTO> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return goodsReceiptNoteRepository.pagination(pageable);
    }

    @Override
    public GoodsReceiptNote getDetails(int id) {
        return goodsReceiptNoteRepository.findById(id);
    }

    @Override
    public GoodsReceiptNote createGrn(CreateGrnDTO createGrnDTO) {
        GoodsReceiptNote grn = new GoodsReceiptNote();
        BeanUtils.copyProperties(createGrnDTO, grn);

        int vendorId = createGrnDTO.getVendorId();
        Vendor vendor = vendorRepository.findById(vendorId);
        grn.setVendor(vendor);

        BusinessPeriod bp = businessPeriodRepository.getCurrent();
        grn.setBusinessPeriod(bp);

        grn.setDateCreate(Instant.now());
        grn.setTotalAmount(BigDecimal.ZERO);

        return goodsReceiptNoteRepository.save(grn);
    }

    @Override
    public Boolean isDuplicateInvoiceNumber(String invoiceNumber) {
        return goodsReceiptNoteRepository.findByInvoiceNumber(invoiceNumber) != null;
    }

    @Override
    public void update(GoodsReceiptNote grn, CreateGrnDTO createGrnDTO) {
        BeanUtils.copyProperties(createGrnDTO, grn);
        int vendorId = createGrnDTO.getVendorId();
        if (vendorId != grn.getVendor().getId()) {
            grn.setVendor(vendorRepository.findById(vendorId));
        }
        goodsReceiptNoteRepository.save(grn);
    }

    @Override
    @Transactional
    public void confirm(GoodsReceiptNote grn, List<LightGrnItemDTO> grnItems) {
        List<Integer> productIds = new ArrayList<>();
        // use productId as key as productId is unique in this case
        Map<Integer, ImportValueDTO> importValues = new HashMap<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (LightGrnItemDTO grnItem : grnItems) {
            // only get distinct product ids
            if (!productIds.contains(grnItem.getProductId())) {
                productIds.add(grnItem.getProductId());
            }
            if (importValues.containsKey(grnItem.getProductId())) {
                ImportValueDTO importValue = importValues.get(grnItem.getProductId());
                // set quantity import
                importValue.setQuantityImport(
                        importValue.getQuantityImport() + grnItem.getQuantityImport()
                );
                // set import amount
                BigDecimal unitCost = grnItem.getUnitCost();
                BigDecimal importAmount = unitCost.multiply(
                        BigDecimal.valueOf(grnItem.getQuantityImport())
                );
                importValue.setImportAmount(
                        importValue.getImportAmount().add(importAmount)
                );

                // set inputVAT
                BigDecimal inputVAT = importAmount.multiply(
                        BigDecimal.valueOf(grnItem.getVatRate())
                );
                importValue.setInputVAT(
                        importValue.getInputVAT().add(inputVAT)
                );

                // update for total amount field in GRN
                totalAmount = totalAmount.add(
                        importAmount.multiply(
                                BigDecimal.valueOf(1 + grnItem.getVatRate())
                        )
                );
            }
            else {
                ImportValueDTO importValue = new ImportValueDTO();
                importValue.setQuantityImport(grnItem.getQuantityImport());

                // handle multiply with Integer and BigDecimal
                BigDecimal unitCost = grnItem.getUnitCost();
                BigDecimal importAmount = unitCost.multiply(
                        BigDecimal.valueOf(grnItem.getQuantityImport())
                );
                importValue.setImportAmount(importAmount);
                importValues.put(grnItem.getProductId(), importValue);

                BigDecimal inputVat = importAmount.multiply(
                        BigDecimal.valueOf(grnItem.getVatRate())
                );
                importValue.setInputVAT(inputVat);

                totalAmount = totalAmount.add(
                        importAmount.multiply(
                                BigDecimal.valueOf(1 + grnItem.getVatRate())
                        )
                );
            }
        }
        // get list of product inventories
        List<ProductInventory> productInventories = productInventoryRepository.findAllByProductIds(productIds);
        for (ProductInventory p : productInventories) {
            if (importValues.containsKey(p.getProduct().getId())) {
                ImportValueDTO importValue = importValues.get(p.getProduct().getId());
                p.setImportQuantity(
                        p.getImportQuantity() + importValue.getQuantityImport()
                );
                BigDecimal importAmount = importValue.getImportAmount();
                p.setImportAmount(
                        p.getImportAmount().add(importAmount)
                );
            }
        }

        productInventoryRepository.saveAll(productInventories);
        grn.setIsConfirmed(true);
        grn.setTotalAmount(totalAmount);
        goodsReceiptNoteRepository.save(grn);
    }

    @Override
    @Transactional
    public void delete(GoodsReceiptNote grn) {
        grnItemRepository.deleteByGrnId(grn.getId());
        goodsReceiptNoteRepository.delete(grn);
    }
}

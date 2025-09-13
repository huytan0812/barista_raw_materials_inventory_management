package com.bar_raw_materials.services.goodsReceiptItem;

import com.bar_raw_materials.dto.goodsReceiptItem.CreateGrnItemDTO;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.repositories.GoodsReceiptItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoodsReceiptItemServiceImpl implements GoodsReceiptItemService {
    private final GoodsReceiptItemRepository goodsReceiptItemRepository;

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
    public Page<GoodsReceiptItem> getPageByGrnId(
            Integer grnId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return goodsReceiptItemRepository.getPageByGrnId(grnId, pageable);
    }

    @Override
    public void createGrnItem(GoodsReceiptItem grnItem) {
        goodsReceiptItemRepository.save(grnItem);
    }
}

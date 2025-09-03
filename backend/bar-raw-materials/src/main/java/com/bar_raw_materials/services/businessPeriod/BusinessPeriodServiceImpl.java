package com.bar_raw_materials.services.businessPeriod;

import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.Product;
import com.bar_raw_materials.entities.ProductInventory;
import com.bar_raw_materials.repositories.BusinessPeriodRepository;
import com.bar_raw_materials.repositories.ProductInventoryRepository;
import com.bar_raw_materials.repositories.ProductRepository;
import com.bar_raw_materials.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessPeriodServiceImpl implements BusinessPeriodService {
    private final BusinessPeriodRepository businessPeriodRepository;
    private final DateTimeUtils dateTimeUtils;
    private final ProductRepository productRepository;
    private final ProductInventoryRepository productInventoryRepository;

    @Override
    public List<BusinessPeriod> getAll() {
        return businessPeriodRepository.findAll();
    }

    @Override
    public Page<BusinessPeriod> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return businessPeriodRepository.findAll(pageable);
    }

    @Override
    public <T> T getDetails(int id) {
        return null;
    }

    @Override
    public BusinessPeriod getCurrent() {
        return businessPeriodRepository.getCurrent();
    }

    @Override
    @Transactional
    public void create() {
        LocalDate today = LocalDate.now();
        int quarter = dateTimeUtils.getQuarter(today);
        int year = today.getYear();

        LocalDate getStartDate = dateTimeUtils.getStart(quarter, year);
        LocalDate getEndDate = dateTimeUtils.getEnd(quarter, year);

        String periodType = "QUARTER";
        String label = "Quý " + quarter + ", năm " + year;

        BusinessPeriod businessPeriod = new BusinessPeriod(
                periodType,
                getStartDate,
                getEndDate,
                label
        );
        // save() will return void
        businessPeriodRepository.save(businessPeriod);

        List<Product> products = productRepository.findAllOrderByProductIdAsc();
        List<ProductInventory> productInventories = new ArrayList<>();
        for (Product product : products) {
            productInventories.add(new ProductInventory(
                    product,
                    businessPeriod
            ));
        }
        // bulk update
        productInventoryRepository.saveAll(productInventories);
    }
}

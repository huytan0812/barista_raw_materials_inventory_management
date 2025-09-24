package com.bar_raw_materials.services.salesOrder;

import com.bar_raw_materials.dto.salesOrder.CreateSalesOrderDTO;
import com.bar_raw_materials.dto.salesOrder.SalesOrderDTO;
import com.bar_raw_materials.entities.BusinessPeriod;
import com.bar_raw_materials.entities.Customer;
import com.bar_raw_materials.entities.SalesOrder;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.exceptions.customer.CustomerDoesNotExistException;
import com.bar_raw_materials.services.customer.CustomerService;
import com.bar_raw_materials.repositories.SalesOrderRepository;
import com.bar_raw_materials.services.businessPeriod.BusinessPeriodService;
import com.bar_raw_materials.utils.AuthUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesOrderServiceImpl implements SalesOrderService{
    private final SalesOrderRepository salesOrderRepository;
    private final CustomerService customerService;
    private final BusinessPeriodService businessPeriodService;
    private final AuthUtils authUtils;

    @Override
    public List<?> getAll() {
        return List.of();
    }

    @Override
    public Page<?> getPage(int page, int size) {
        return null;
    }

    @Override
    public SalesOrderDTO getDetails(int id) {
        return salesOrderRepository.findById(id);
    }

    @Override
    public SalesOrder getSalesOrder(int id) {
        return salesOrderRepository.findSalesOrderById(id);
    }

    @Override
    public SalesOrder addSalesOrder(CreateSalesOrderDTO createSalesOrderDTO) {
        SalesOrder salesOrder = new SalesOrder();
        Customer customer = customerService.getDetails(createSalesOrderDTO.getCustomerId());
        if (customer == null) {
            throw new CustomerDoesNotExistException("Khách hàng không tồn tại");
        }

        BeanUtils.copyProperties(createSalesOrderDTO, salesOrder);
        salesOrder.setCustomer(customer);
        User currentUser = authUtils.getCurrentAuthorizedUser();
        salesOrder.setCreatedBy(currentUser);
        BusinessPeriod currentBp = businessPeriodService.getCurrent();
        salesOrder.setBusinessPeriod(currentBp);
        salesOrder.setDateCreated(Instant.now());
        salesOrder.setTotalAmount(BigDecimal.ZERO);
        return salesOrderRepository.save(salesOrder);
    }
}

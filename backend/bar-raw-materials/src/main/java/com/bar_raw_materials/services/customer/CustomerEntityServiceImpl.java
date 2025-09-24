package com.bar_raw_materials.services.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.time.Instant;

import com.bar_raw_materials.repositories.CustomerRepository;
import com.bar_raw_materials.entities.Customer;
import com.bar_raw_materials.dto.customer.CreateCustomerDTO;
import com.bar_raw_materials.dto.customer.LightCustomerDTO;
import com.bar_raw_materials.exceptions.customer.DuplicatedPhoneNumberException;

@Service
@RequiredArgsConstructor
public class CustomerEntityServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    @Override
    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    @Override
    public Page<Customer> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return customerRepository.pagination(pageable);
    }

    @Override
    public Customer getDetails(int id) {
        return customerRepository.findCustomerById(id);
    }

    @Override
    public List<LightCustomerDTO> getAllLightCustomers() {
        return customerRepository.findAllLightCustomers();
    }

    @Override
    public Customer addCustomer(CreateCustomerDTO createCustomerDTO) {
        if (isDuplicatedPhoneNumber(createCustomerDTO.getPhoneNumber())) {
            throw new DuplicatedPhoneNumberException("Số điện thoại này đã đăng ký trước đó");
        }
        Customer customer = new Customer();
        BeanUtils.copyProperties(createCustomerDTO, customer);
        customer.setCustomerRank("Đồng");
        customer.setBonusDiscount(0f);
        customer.setTotalBuy(BigDecimal.ZERO);
        customer.setDateCreated(Instant.now());
        customerRepository.save(customer);
        return customer;
    }

    @Override
    public Boolean isDuplicatedPhoneNumber(String phoneNumber) {
        return customerRepository.findCustomerByPhoneNumber(phoneNumber) != null;
    }
}

package com.bar_raw_materials.services.customer;

import com.bar_raw_materials.dto.customer.CreateCustomerDTO;
import com.bar_raw_materials.dto.customer.LightCustomerDTO;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.entities.Customer;

import java.util.List;

public interface CustomerService extends EntityService {
    List<LightCustomerDTO> getAllLightCustomers();
    Customer addCustomer(CreateCustomerDTO createCustomerDTO);
    Boolean isDuplicatedPhoneNumber(String phoneNumber);
}

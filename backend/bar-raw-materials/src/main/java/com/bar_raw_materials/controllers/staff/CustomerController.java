package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.customer.CreateCustomerDTO;
import com.bar_raw_materials.dto.customer.LightCustomerDTO;
import com.bar_raw_materials.entities.Customer;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.services.customer.CustomerService;

import java.util.List;

@RestController
@RequestMapping("${apiStaff}/customer")
public class CustomerController extends BaseStaffController{
    CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        super(customerService);
        this.customerService = customerService;
    }

    @GetMapping("allLight")
    public List<LightCustomerDTO> allLight() {
        return customerService.getAllLightCustomers();
    }

    @PostMapping("add")
    public ResponseEntity<LightCustomerDTO> add(
            @RequestPart("data")CreateCustomerDTO createCustomerDTO
    ) {
        Customer customer = customerService.addCustomer(createCustomerDTO);
        LightCustomerDTO lightCustomerDTO = new LightCustomerDTO();
        BeanUtils.copyProperties(customer, lightCustomerDTO);
        return ResponseEntity.ok(lightCustomerDTO);
    }
}

package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.Customer;
import com.bar_raw_materials.dto.customer.LightCustomerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query(
            value="SELECT c FROM Customer c"
    )
    Page<Customer> pagination(Pageable pageable);
    @Query(
            value="SELECT new com.bar_raw_materials.dto.customer.LightCustomerDTO(" +
                    "c.id, c.name, c.phoneNumber" +
                    ") FROM Customer c"
    )
    List<LightCustomerDTO> findAllLightCustomers();
    Customer findCustomerByPhoneNumber(String phoneNumber);
}

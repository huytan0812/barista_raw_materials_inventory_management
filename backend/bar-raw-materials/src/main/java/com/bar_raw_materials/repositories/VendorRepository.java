package com.bar_raw_materials.repositories;

import com.bar_raw_materials.entities.Vendor;
import com.bar_raw_materials.dto.vendor.LightVendorDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Integer> {
    @Query(
            value="SELECT new com.bar_raw_materials.dto.vendor.LightVendorDTO(" +
                    "v.id, v.name" +
                    ") FROM Vendor v"
    )
    List<LightVendorDTO> findAllLightVendors();

    Vendor findByTaxCode(String taxCode);

    Vendor findById(int id);
}

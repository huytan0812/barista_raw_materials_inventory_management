package com.bar_raw_materials.services;

import org.springframework.data.domain.Page;

import java.util.List;

public interface EntityService {
    List<?> getAll();
    Page<?> getPage(int page, int size);
    <T> T getDetails(int id);
}

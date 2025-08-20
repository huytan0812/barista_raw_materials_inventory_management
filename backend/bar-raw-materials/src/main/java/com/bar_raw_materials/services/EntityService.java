package com.bar_raw_materials.services;

import java.util.List;

public interface EntityService {
    List<?> getAll();
    <T> T getDetails(int id);
}

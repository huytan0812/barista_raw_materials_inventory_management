package com.bar_raw_materials.services.user;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.dto.user.LightUserDTO;

import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService extends EntityService {
    List<User> getAll();
    Page<User> getPage(int page, int size);
    User getDetails(int id);
}

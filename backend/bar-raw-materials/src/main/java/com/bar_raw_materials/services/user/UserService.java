package com.bar_raw_materials.services.user;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.EntityService;

import java.util.List;

public interface UserService extends EntityService {
    List<User> getAll();
    User getDetails(int id);
}

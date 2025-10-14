package com.bar_raw_materials.services.user;

import com.bar_raw_materials.dto.user.CreateUserDTO;
import com.bar_raw_materials.dto.user.EditUserDTO;
import com.bar_raw_materials.dto.user.PasswordDTO;
import com.bar_raw_materials.entities.Role;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.EntityService;
import com.bar_raw_materials.dto.user.LightUserDTO;

import org.springframework.data.domain.Page;

import javax.swing.text.StyledEditorKit;
import java.util.List;

public interface UserService extends EntityService {
    List<User> getAll();
    Page<User> getPage(int page, int size);
    User getDetails(int id);
    List<Role> getAllRole();
    void addUser(CreateUserDTO createUserDTO);
    void updateUser(Integer userId, EditUserDTO editUserDTO);
    void checkPassword(Integer userId, String password);
    void changePassword(Integer userId, PasswordDTO passwordDTO);
    Boolean isDuplicatedUsername(String username);
    Boolean isDuplicatedPhoneNumber(String phoneNumber);
    Boolean isDuplicatedEmail(String email);
    Boolean isMatchedConfirmPassword(String password, String confirmPassword);
}

package com.bar_raw_materials.services.user;

import com.bar_raw_materials.dto.user.CreateUserDTO;
import com.bar_raw_materials.dto.user.EditUserDTO;
import com.bar_raw_materials.dto.user.LightUserDTO;
import com.bar_raw_materials.entities.Role;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.exceptions.user.*;
import com.bar_raw_materials.repositories.UserRepository;
import com.bar_raw_materials.utils.HashingUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.net.UnknownServiceException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final HashingUtils hashingUtils;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public Page<User> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.pagination(pageable);
    }

    @Override
    public User getDetails(int id) {
        return userRepository.findById(id);
    }

    @Override
    public List<Role> getAllRole() {
        return userRepository.findAllRole();
    }

    @Override
    public void addUser(CreateUserDTO createUserDTO) {
        String password = createUserDTO.getPassword();
        String confirmPassword = createUserDTO.getConfirmPassword();
        if (!password.equals(confirmPassword)) {
            throw new ConfirmPasswordDifferentException("Mật khẩu nhắc lại không khớp");
        }

        if (isDuplicatedEmail(createUserDTO.getEmail())) {
            throw new DuplicatedUserEmailException("Email đã tồn tại");
        }
        if (isDuplicatedPhoneNumber(createUserDTO.getPhoneNumber())) {
            throw new DuplicatedUserPhoneNumberException("Số điện thoại đã tồn tại");
        }
        Role role = userRepository.findRoleById(createUserDTO.getRoleId());
        User user = new User();
        user.setRole(role);
        BeanUtils.copyProperties(createUserDTO, user);
        String hashPassword = hashingUtils.hash(user.getPassword());
        user.setPassword(hashPassword);
        System.out.println("Gender: " + user.getGender());
        userRepository.save(user);
    }

    @Override
    public void updateUser(Integer userId, EditUserDTO editUserDTO) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new UserNotFoundException("Không tìm thấy tài khoản");
        }
        if (!editUserDTO.getUsername().equals(user.getUsername())) {
            if (isDuplicatedUsername(editUserDTO.getUsername())) {
                throw new DuplicatedUsernameException("Tên tài khoản đã tồn tại");
            }
        }
        if (!editUserDTO.getEmail().equals(user.getEmail())) {
            if (isDuplicatedEmail(editUserDTO.getEmail())) {
                throw new DuplicatedUserEmailException("Email đã tồn tại");
            }
        }
        if (!editUserDTO.getPhoneNumber().equals(user.getPhoneNumber())) {
            if (isDuplicatedPhoneNumber(editUserDTO.getPhoneNumber())) {
                throw new DuplicatedUserPhoneNumberException("Số điện thoại đã tồn tại");
            }
        }
        if (!Objects.equals(user.getRole().getId(), editUserDTO.getRoleId())) {
            Role role = userRepository.findRoleById(editUserDTO.getRoleId());
            user.setRole(role);
        }
        BeanUtils.copyProperties(editUserDTO, user);
        userRepository.save(user);
    }

    @Override
    public Boolean isDuplicatedUsername(String username) {
        return userRepository.findByUsername(username) != null;
    }

    @Override
    public Boolean isDuplicatedPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber) != null;
    }

    @Override
    public Boolean isDuplicatedEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }
}

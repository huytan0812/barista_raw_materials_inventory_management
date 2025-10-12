package com.bar_raw_materials.services.user;

import com.bar_raw_materials.dto.user.CreateUserDTO;
import com.bar_raw_materials.dto.user.EditUserDTO;
import com.bar_raw_materials.dto.user.PasswordDTO;
import com.bar_raw_materials.entities.Role;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.exceptions.user.*;
import com.bar_raw_materials.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        if (!isMatchedConfirmPassword(password, confirmPassword)) {
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
        String hashPassword = passwordEncoder.encode(password);
        user.setPassword(hashPassword);
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
    public void checkPassword(Integer userId, String password) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new UserNotFoundException("Không tìm thấy tài khoản");
        }
        if (!isMatchedHashPassword(user.getPassword(), password)) {
            throw new PasswordDoesNotMatchException("Mật khẩu không khớp");
        }
    }

    @Override
    public void changePassword(Integer userId, PasswordDTO passwordDTO) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new UserNotFoundException("Không tìm thấy tài khoản");
        }
        String password = passwordDTO.getPassword();
        String confirmPassword = passwordDTO.getConfirmPassword();
        if (!isMatchedConfirmPassword(password, confirmPassword)) {
            throw new ConfirmPasswordDifferentException("Mật khẩu nhắc lại không khớp");
        }
        user.setPassword(passwordEncoder.encode(password));
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

    @Override
    public Boolean isMatchedHashPassword(String currentPassword, String inputPassword) {
        String hashCurrentPassword = passwordEncoder.encode(currentPassword);
        String hashInputPassword = passwordEncoder.encode(inputPassword);
        return hashCurrentPassword.equals(hashInputPassword);
    }

    @Override
    public Boolean isMatchedConfirmPassword(String password, String confirmPassword) {
        return confirmPassword.equals(password);
    }
}

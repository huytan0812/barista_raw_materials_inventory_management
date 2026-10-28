package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.dto.user.CreateUserDTO;
import com.bar_raw_materials.dto.user.EditUserDTO;
import com.bar_raw_materials.dto.user.PasswordDTO;
import com.bar_raw_materials.entities.Role;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.user.UserService;
import com.bar_raw_materials.dto.user.LightUserDTO;

import com.bar_raw_materials.utils.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("${apiStaff}/user")
public class UserController extends BaseStaffController {
    UserService userService;
    AuthUtils authUtils;

    @Autowired
    public UserController(UserService userService, AuthUtils authUtils) {
        super(userService);
        this.userService = userService;
        this.authUtils = authUtils;
    }

    @GetMapping("role")
    public ResponseEntity<Map<String, String>> getRole() {
        User user = authUtils.getCurrentAuthorizedUser();
        Map<String, String> responseData = new HashMap<>();
        responseData.put("role", user.getRole().getRole());
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("allRole")
    public ResponseEntity<List<Role>> getAllRole() {
        List<Role> roles = userService.getAllRole();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("lightInfo")
    public ResponseEntity<LightUserDTO> getLightInfo() {
        User user = authUtils.getCurrentAuthorizedUser();
        LightUserDTO lightUserDTO = new LightUserDTO();
        BeanUtils.copyProperties(user, lightUserDTO);
        lightUserDTO.setRoleId(user.getRole().getId());
        return ResponseEntity.ok(lightUserDTO);
    }

    // account management: the inherited listing endpoints expose every account, so they are admin only
    @Override
    @GetMapping("all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<?>> getAll() {
        return super.getAll();
    }

    @Override
    @GetMapping("list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<?>> getPage(
            @Nullable @RequestParam(defaultValue="0", name="page") int page,
            @Nullable @RequestParam(defaultValue="10", name="size") int size
    ) {
        return super.getPage(page, size);
    }

    @Override
    @GetMapping("details/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.id")
    public <T> ResponseEntity<T> getById(@PathVariable("id") Integer id) {
        return super.getById(id);
    }

    @PostMapping("add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> add(
            @RequestPart("data") CreateUserDTO createUserDTO
    ) {
        userService.addUser(createUserDTO);
        return ResponseEntity.ok("User added successfully");
    }

    @PostMapping("update/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.id")
    public ResponseEntity<String> update(
            @PathVariable("id") Integer id,
            @RequestPart("data") EditUserDTO editUserDTO
    ) {
        // staff may edit their own profile but not grant themselves another role or (re)activate the account
        if (!authUtils.isCurrentUserAdmin()) {
            User currentUser = authUtils.getCurrentAuthorizedUser();
            if (!Objects.equals(editUserDTO.getRoleId(), currentUser.getRole().getId())
                    || !Objects.equals(editUserDTO.getIsActive(), currentUser.getIsActive())) {
                throw new AccessDeniedException("Only an admin can change the role or status of an account");
            }
        }
        userService.updateUser(id, editUserDTO);
        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("checkPassword/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.id")
    public ResponseEntity<String> checkPassword(
            @PathVariable("id") Integer id,
            @RequestBody Map<String, String> password
    ) {
        userService.checkPassword(id, password.get("password"));
        return ResponseEntity.ok("Password check successfully");
    }

    @PostMapping("resetPassword/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.id")
    public ResponseEntity<String> resetPassword(
            @PathVariable("id") Integer id,
            @Valid @RequestBody PasswordDTO passwordDTO
    ) {
        userService.changePassword(id, passwordDTO);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}

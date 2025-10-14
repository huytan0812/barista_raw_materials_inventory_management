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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<User> getLightInfo() {
        User user = authUtils.getCurrentAuthorizedUser();
        System.out.println(user.getId());
        return ResponseEntity.ok(user);
    }

    @PostMapping("add")
    public ResponseEntity<String> add(
            @RequestPart("data") CreateUserDTO createUserDTO
    ) {
        userService.addUser(createUserDTO);
        return ResponseEntity.ok("User added successfully");
    }

    @PostMapping("update/{id}")
    public ResponseEntity<String> update(
            @PathVariable("id") Integer id,
            @RequestPart("data") EditUserDTO editUserDTO
    ) {
        userService.updateUser(id, editUserDTO);
        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("checkPassword/{id}")
    public ResponseEntity<String> checkPassword(
            @PathVariable("id") Integer id,
            @RequestBody Map<String, String> password
    ) {
        userService.checkPassword(id, password.get("password"));
        return ResponseEntity.ok("Password check successfully");
    }

    @PostMapping("resetPassword/{id}")
    public ResponseEntity<String> resetPassword(
            @PathVariable("id") Integer id,
            @Valid @RequestBody PasswordDTO passwordDTO
    ) {
        userService.changePassword(id, passwordDTO);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}

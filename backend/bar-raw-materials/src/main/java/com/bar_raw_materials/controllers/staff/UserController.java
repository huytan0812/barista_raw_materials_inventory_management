package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.user.UserService;

import com.bar_raw_materials.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.user.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${apiStaff}/user")
public class UserController extends BaseStaffController {
    UserService userService;

    public UserController(UserService userService) {
        super(userService);
        this.userService = userService;
    }
}

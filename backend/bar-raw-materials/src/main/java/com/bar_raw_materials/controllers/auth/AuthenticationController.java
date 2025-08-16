package com.bar_raw_materials.controllers.auth;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.auth.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.bar_raw_materials.dto.auth.AuthenticationResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("login")
    public AuthenticationResponse login(@RequestBody User request) {
        return authenticationService.login(request);
    }
}

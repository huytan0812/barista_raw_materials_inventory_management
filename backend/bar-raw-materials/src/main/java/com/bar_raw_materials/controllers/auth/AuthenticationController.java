package com.bar_raw_materials.controllers.auth;

import com.bar_raw_materials.dto.auth.JwtDTO;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.services.auth.AuthenticationService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

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

    @PostMapping("verifyJWT")
    public ResponseEntity<Map<String, Boolean>> verifyJWT(
            @RequestBody JwtDTO request
    ) {
        Map<String, Boolean> response = new HashMap<>();
        String jwt = request.getToken();
        Boolean isTokenValid = false;
        response.put("isTokenValid", isTokenValid);
        try {
            isTokenValid = authenticationService.isTokenValid(jwt);
            response.put("isJWTValid", isTokenValid);
        }
        catch (ExpiredJwtException e) {
            System.out.println("Expired JWT");
            ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}

package com.bar_raw_materials.services.auth;

import com.bar_raw_materials.config.UserDetailsServiceImpl;
import com.bar_raw_materials.dto.auth.AuthenticationResponse;
import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.repositories.UserRepository;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    // why don't use autowired, but use @RequiredArgsConstructor instead?
    // why use autowired, field injection is not recommended is trigger
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse login(User request) {
        // get user by username if username is valid
        // check if username is valid
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new UsernameNotFoundException("Tài khoản không tồn tại");
        }
        // check if password is match
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UsernameNotFoundException("Mật khẩu sai");
        }

        UserDetails userDetails = new UserDetailsServiceImpl.UserDetailsImpl(user);
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
    }
}

package com.nguyenminhtri.example05.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenminhtri.example05.dto.LoginCredentials;
import com.nguyenminhtri.example05.dto.UserDTO;
import com.nguyenminhtri.example05.exceptions.UserNotFoundException;
import com.nguyenminhtri.example05.security.JWTUtil;
import com.nguyenminhtri.example05.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerHandler(@Valid @RequestBody UserDTO user)
            throws UserNotFoundException {
        String encodedPass = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPass);
        UserDTO userDTO = userService.registerUser(user);
        String token = jwtUtil.generateToken(userDTO.getEmail());
        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("jwt-token", token),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public Map<String, Object> loginHandler(@Valid @RequestBody LoginCredentials credentials) {
        UsernamePasswordAuthenticationToken authCredentials = new UsernamePasswordAuthenticationToken(
                credentials.getEmail(), credentials.getPassword());
        authenticationManager.authenticate(authCredentials);
        String token = jwtUtil.generateToken(credentials.getEmail());
        return Collections.singletonMap("jwt-token", token);
    }

    @GetMapping("/test-token")
    public ResponseEntity<String> testToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok("Token hợp lệ. User: " + authentication.getName() + 
                                  ", Authorities: " + authentication.getAuthorities());
        }
        return ResponseEntity.status(401).body("Token không hợp lệ");
    }
}
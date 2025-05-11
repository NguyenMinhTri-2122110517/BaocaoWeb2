package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenminhtri.example05.config.AppConstants;
import com.nguyenminhtri.example05.entity.Cart;
import com.nguyenminhtri.example05.entity.Role;
import com.nguyenminhtri.example05.entity.User;
import com.nguyenminhtri.example05.repository.RoleRepo;
import com.nguyenminhtri.example05.repository.UserRepo;
import com.nguyenminhtri.example05.security.JWTUtil;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class TestController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping("/public/test-add-user")
    public ResponseEntity<String> testAddUser() {
        try {
            String testEmail = "tringuyen28082k4@gmail.com";
            String firstName = "Tri";
            String lastName = "Nguyen";
            String testPicture = "https://lh3.googleusercontent.com/a/ACg8ocLDBBFFxL0Vat3wz_3BCC49ihqlIvs4rB035PlNOjquPQ67fg=s96-c";
            
            User user = userRepo.findByEmail(testEmail).orElse(null);
            
            if (user == null) {
                user = new User();
                user.setEmail(testEmail);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setPicture(testPicture);
                user.setImageUrl(testPicture);
                user.setProvider("google");
                user.setMobileNumber("0000000000");
                user.setPassword("");
                
                // Tạo giỏ hàng mới
                Cart cart = new Cart();
                cart.setUser(user);
                user.setCart(cart);
                
                // Lưu user trước để có user_id
                user = userRepo.save(user);
                
                // Thêm role cho user
                Role userRole = roleRepo.findById(AppConstants.USER_ID).get();
                user.getRoles().add(userRole);
                
                // Lưu lại user để cập nhật roles
                userRepo.save(user);
                
                return ResponseEntity.ok("Đã thêm user thành công với email: " + testEmail);
            }
            
            return ResponseEntity.ok("User đã tồn tại với email: " + testEmail);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/public/test-success")
    public ResponseEntity<String> testSuccess() {
        return ResponseEntity.ok("Đăng nhập Google thành công!");
    }

    @GetMapping("/public/test-failure") 
    public ResponseEntity<String> testFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Đăng nhập Google thất bại!");
    }

    @GetMapping("/public/process-google-login")
    public void processGoogleLogin(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String picture,
            HttpServletResponse response) throws IOException {
        try {
            User user = userRepo.findByEmail(email).orElse(null);
            
            if (user == null) {
                user = new User();
                user.setEmail(email);
                
                // Tách tên
                String[] nameParts = name.split(" ", 2);
                user.setFirstName(nameParts[0]);
                user.setLastName(nameParts.length > 1 ? nameParts[1] : nameParts[0]);
                
                user.setPicture(picture);
                user.setImageUrl(picture);
                user.setProvider("google");
                user.setMobileNumber("0000000000");
                user.setPassword("");
                
                // Tạo giỏ hàng mới
                Cart cart = new Cart();
                cart.setUser(user);
                user.setCart(cart);
                
                // Lưu user trước để có user_id
                user = userRepo.save(user);
                
                // Thêm role cho user
                Role userRole = roleRepo.findById(AppConstants.USER_ID).get();
                user.getRoles().add(userRole);
                
                // Lưu lại user để cập nhật roles
                userRepo.save(user);
            }
            
            // Tạo JWT token
            String token = jwtUtil.generateToken(email);
            
            // Chuyển hướng về frontend với token
            response.sendRedirect("http://localhost:3000?token=" + token);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login?error=true");
        }
    }
} 
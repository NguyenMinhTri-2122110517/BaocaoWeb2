package com.nguyenminhtri.example05.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.nguyenminhtri.example05.config.AppConstants;
import com.nguyenminhtri.example05.entity.Cart;
import com.nguyenminhtri.example05.entity.Role;
import com.nguyenminhtri.example05.entity.User;
import com.nguyenminhtri.example05.repository.RoleRepo;
import com.nguyenminhtri.example05.repository.UserRepo;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private RoleRepo roleRepo;
    
    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        try {
            // Lấy thông tin từ Google
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");
            
            // Kiểm tra và tạo user nếu chưa tồn tại
            User user = userRepo.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                
                // Xử lý tên
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
                
                // Lưu user để có user_id
                user = userRepo.save(user);
                
                // Thêm ROLE_USER
                Role userRole = roleRepo.findById(AppConstants.USER_ID).get();
                user.getRoles().add(userRole);
                
                // Lưu lại để cập nhật role
                userRepo.save(user);
            }
            
            // Tạo JWT token
            String token = jwtUtil.generateToken(email);
            
            // Chuyển hướng về frontend với token
            String redirectUrl = "http://localhost:3000/login?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
            super.setAlwaysUseDefaultTargetUrl(false);
            super.setDefaultTargetUrl(redirectUrl);
            super.onAuthenticationSuccess(request, response, authentication);
            
        } catch (Exception e) {
            e.printStackTrace();
            String errorUrl = "http://localhost:3000/login?error=true";
            super.setDefaultTargetUrl(errorUrl);
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
} 
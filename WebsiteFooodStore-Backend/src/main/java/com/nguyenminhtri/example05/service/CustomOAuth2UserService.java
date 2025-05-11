package com.nguyenminhtri.example05.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.config.AppConstants;
import com.nguyenminhtri.example05.entity.Cart;
import com.nguyenminhtri.example05.entity.Role;
import com.nguyenminhtri.example05.entity.User;
import com.nguyenminhtri.example05.repository.RoleRepo;
import com.nguyenminhtri.example05.repository.UserRepo;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        try {
            // Lấy thông tin từ Google OAuth response
            Map<String, Object> attributes = oauth2User.getAttributes();
            System.out.println("Google Info: " + attributes); // Log để debug
            
            String email = (String) attributes.get("email");
            String fullName = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");
            
            // Kiểm tra user đã tồn tại chưa
            User user = userRepo.findByEmail(email).orElse(null);
            
            if (user == null) {
                // Tạo user mới
                user = new User();
                user.setEmail(email);
                
                // Xử lý tên
                String[] nameParts = fullName.split(" ", 2);
                user.setFirstName(nameParts[0]);
                user.setLastName(nameParts.length > 1 ? nameParts[1] : nameParts[0]);
                
                // Set các thông tin khác
                user.setPicture(picture);
                user.setImageUrl(picture);
                user.setProvider("google");
                user.setMobileNumber("0000000000"); // Giá trị mặc định
                user.setPassword(""); // Password rỗng vì dùng OAuth
                
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
                
                System.out.println("Đã tạo user mới: " + email); // Log để debug
            } else {
                // Cập nhật thông tin nếu user đã tồn tại
                user.setPicture(picture);
                user.setImageUrl(picture);
                userRepo.save(user);
                System.out.println("Đã cập nhật user: " + email); // Log để debug
            }
            
            return oauth2User;
            
        } catch (Exception e) {
            System.out.println("Lỗi xử lý OAuth2: " + e.getMessage()); // Log lỗi
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Lỗi xử lý đăng nhập Google: " + e.getMessage());
        }
    }
}

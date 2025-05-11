package com.nguyenminhtri.example05.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenminhtri.example05.config.AppConstants;
import com.nguyenminhtri.example05.dto.AddressDTO;
import com.nguyenminhtri.example05.dto.UserDTO;
import com.nguyenminhtri.example05.dto.UserResponse;
import com.nguyenminhtri.example05.service.CustomOAuth2UserService;
import com.nguyenminhtri.example05.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
// import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/admin/users")
    public ResponseEntity<UserResponse> getUsers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        UserResponse userResponse = userService.getAllUsers(pageNumber, pageSize, sortBy,
                sortOrder);
        return new ResponseEntity<UserResponse>(userResponse, HttpStatus.FOUND);
    }

    @GetMapping("/public/users/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return new ResponseEntity<UserDTO>(user, HttpStatus.FOUND);
    }

    @GetMapping("/public/users/email/{email}")
    public ResponseEntity<UserDTO> getUserEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
    }

    @PutMapping("/public/users/{userId}/addresses/{addressId}")
    public ResponseEntity<UserDTO> addAddressToUser(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        UserDTO updatedUser = userService.addAddressToUser(userId, addressId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
    @GetMapping("/public/users/{email}/addresses")
public ResponseEntity<List<AddressDTO>> getUserAddresses(@PathVariable String email) {
    List<AddressDTO> addresses = userService.getUserAddresses(email);
    return new ResponseEntity<>(addresses, HttpStatus.OK);
}

    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        String status = userService.deleteUser(userId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<String> oauth2Success() {
        return ResponseEntity.ok("OAuth2 login successful!");
    }

    @GetMapping("/test-oauth")
    public ResponseEntity<String> testOAuth() {
        try {
            // Tạo một OAuth2UserRequest giả lập
            CustomOAuth2UserService service = new CustomOAuth2UserService();
            service.loadUser(null);
            return ResponseEntity.ok("Test OAuth successful!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}
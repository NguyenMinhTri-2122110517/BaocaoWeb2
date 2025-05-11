package com.nguyenminhtri.example05.service;
import java.util.List;

import com.nguyenminhtri.example05.dto.AddressDTO;
import com.nguyenminhtri.example05.dto.UserDTO;
import com.nguyenminhtri.example05.dto.UserResponse;
public interface UserService {
  UserDTO registerUser(UserDTO userDTO);

  UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  UserDTO getUserById(Long userId);

  UserDTO updateUser(Long userId, UserDTO userDTO);

  String deleteUser(Long userId);
  UserDTO addAddressToUser(Long userId, Long addressId);
  List<AddressDTO> getUserAddresses(String email);

UserDTO getUserByEmail(String email);
}
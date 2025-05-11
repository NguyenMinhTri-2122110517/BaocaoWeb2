package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.dto.AddressDTO;
import com.nguyenminhtri.example05.entity.Address;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO);

    List<AddressDTO> getAddresses();

    AddressDTO getAddress(Long addressId);

    AddressDTO updateAddress(Long addressId, Address address);

    String deleteAddress(Long addressId);
}
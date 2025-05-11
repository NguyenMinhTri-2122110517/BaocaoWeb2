package com.nguyenminhtri.example05.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.addresses a WHERE a.addressId = :addressId")
    List<User> findByAddress(@Param("addressId") Long addressId);

    Optional<User> findByEmail(String email);
}
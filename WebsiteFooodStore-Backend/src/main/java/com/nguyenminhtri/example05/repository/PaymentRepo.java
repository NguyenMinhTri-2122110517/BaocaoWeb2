package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.Payment;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    // Bạn có thể thêm các phương thức tùy chỉnh ở đây nếu cần
}
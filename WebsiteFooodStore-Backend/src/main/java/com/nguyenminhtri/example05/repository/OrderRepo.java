package com.nguyenminhtri.example05.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.Order;
import com.nguyenminhtri.example05.entity.User;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.email = ?1 AND o.id = ?2")
    Order findOrderByEmailAndOrderId(String email, Long cartId);

    List<Order> findAllByEmail(String emailId);

    List<Order> findByUser(User user);

    List<Order> findByEmail(String email);

    Order findByEmailAndId(String email, Long orderId);
}
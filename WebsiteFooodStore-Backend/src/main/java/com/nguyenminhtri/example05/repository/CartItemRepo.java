package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.CartItem;
import com.nguyenminhtri.example05.entity.Product;

import java.util.List;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    @Query("SELECT ci.product FROM CartItem ci WHERE ci.product.id = ?1")
    Product findProductById(Long productId);

    // @Query("SELECT ci.cart FROM CartItem ci WHERE ci.product.id = ?1")
    // List<Cart> findCartsByProductId(Long productId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = ?1 AND ci.product.productId = ?2")
    List<CartItem> findCartItemsByCartCartIdAndProductProductId(Long cartId, Long productId);

    // @Query("SELECT ci.cart FROM CartItem ci WHERE ci.cart.user.email = ?1 AND ci.cart.id = ?2")
    // CartItem findCartByEmailAndCartId(String email, Integer cartId);

    // @Query("SELECT ci.order FROM CartItem ci WHERE ci.order.user.email = ?1 AND ci.order.id = ?2")
    // Order findOrderByEmailAndOrderId(String email, Integer orderId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = ?1 AND ci.product.productId = ?2")
    List<CartItem> findAllByCartIdAndProductId(Long cartId, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.cartId = ?1 AND ci.product.productId = ?2")
    void deleteAllByCartIdAndProductId(Long cartId, Long productId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = ?1 AND ci.product.productId = ?2")
    CartItem findByCartIdAndProductId(Long cartId, Long productId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = ?1 AND ci.product.productId = ?2")
    CartItem findCartItemByProductProductIdAndCartCartId(Long productId, Long cartId);
}
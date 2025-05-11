package com.nguyenminhtri.example05.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.dto.CartDTO;
import com.nguyenminhtri.example05.dto.ProductDTO;
import com.nguyenminhtri.example05.dto.ProductInCartDTO;
import com.nguyenminhtri.example05.entity.Cart;
import com.nguyenminhtri.example05.entity.CartItem;
import com.nguyenminhtri.example05.entity.Product;
import com.nguyenminhtri.example05.exceptions.APIException;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.CartItemRepo;
import com.nguyenminhtri.example05.repository.CartRepo;
import com.nguyenminhtri.example05.repository.ProductRepo;
import com.nguyenminhtri.example05.service.CartService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
        // Tìm cart
        Cart cart = cartRepo.findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "id", cartId));
        
        // Tìm product
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        // Kiểm tra số lượng
        if (product.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        // Tìm cartItem hiện có hoặc tạo mới
        CartItem cartItem = cartItemRepo.findByCartIdAndProductId(cartId, productId);
        
        if (cartItem == null) {
            // Nếu là item mới
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setProductPrice(product.getPrice());
            cartItem.setDiscount(product.getDiscount());
            cart.getCartItems().add(cartItem);
        } else {
            // Nếu item đã tồn tại
            int newQuantity = cartItem.getQuantity() + quantity;
            if (product.getQuantity() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock available");
            }
            cartItem.setQuantity(newQuantity);
        }
        
        // Lưu cart và cartItem
        cartItemRepo.save(cartItem);
        Cart updatedCart = cartRepo.save(cart);
        return mapToDTO(updatedCart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepo.findAll();

        if (carts.isEmpty()) {
            throw new APIException("No carts exist.");
        }

        return carts.stream()
            .map(cart -> {
                CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
                
                Map<Long, ProductInCartDTO> productMap = new HashMap<>();
                
                cart.getCartItems().forEach(item -> {
                    Product product = item.getProduct();
                    Long pId = product.getProductId();
                    
                    if (productMap.containsKey(pId)) {
                        ProductInCartDTO existingProduct = productMap.get(pId);
                        existingProduct.setCartQuantity(existingProduct.getCartQuantity() + item.getQuantity());
                    } else {
                        ProductInCartDTO productDTO = modelMapper.map(product, ProductInCartDTO.class);
                        productDTO.setCartQuantity(item.getQuantity());
                        productMap.put(pId, productDTO);
                    }
                });
                
                cartDTO.setProducts(new ArrayList<>(productMap.values()));
                return cartDTO;
            })
            .collect(Collectors.toList());
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        // Tìm cart theo emailId và cartId
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "id", cartId));

        // Kiểm tra cart có thuộc về user không
       

        return mapToDTO(cart);
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        try {
            // Kiểm tra cart tồn tại
            Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "id", cartId));

            // Kiểm tra product tồn tại
            Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

            // Kiểm tra số lượng hợp lệ
            if (quantity <= 0) {
                throw new APIException("Quantity must be greater than 0");
            }

            // Kiểm tra số lượng tồn kho
            if (product.getQuantity() < quantity) {
                throw new APIException("Not enough stock available. Available: " + product.getQuantity());
            }

            // Tìm cartItem
            CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

            // Cập nhật số lượng
            cartItem.setQuantity(quantity);
            cartItem.setProductPrice(product.getPrice());
            
            // Cập nhật discount nếu có
            if (product.getDiscount() > 0) {
                cartItem.setDiscount(product.getDiscount());
            }

            // Tính lại tổng giá
            double totalPrice = 0.0;
            for (CartItem item : cart.getCartItems()) {
                double itemPrice = item.getProductPrice() * item.getQuantity();
                Double discount = item.getDiscount();
                if (discount != null && discount > 0) {
                    itemPrice = itemPrice * (1 - discount/100.0);
                }
                totalPrice += itemPrice;
            }
            cart.setTotalPrice(totalPrice);

            // Lưu thay đổi
            cartItemRepo.save(cartItem);
            cart = cartRepo.save(cart);

            return mapToDTO(cart);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new APIException("Error updating cart: " + e.getMessage());
        }
    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        
        List<CartItem> cartItems = cartItemRepo.findAllByCartIdAndProductId(cartId, productId);
        
        if (cartItems.isEmpty()) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        double totalPriceReduction = 0;
        int totalQuantity = 0;
        
        for (CartItem cartItem : cartItems) {
            totalPriceReduction += cartItem.getProductPrice() * cartItem.getQuantity();
            totalQuantity += cartItem.getQuantity();
            
            Product product = cartItem.getProduct();
            product.setQuantity(product.getQuantity() + cartItem.getQuantity());
        }
        
        cart.setTotalPrice(cart.getTotalPrice() - totalPriceReduction);
        cartItemRepo.deleteAllByCartIdAndProductId(cartId, productId);

        return "Product removed from the cart successfully!";
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        CartItem cartItem = cartItemRepo.findCartItemByProductProductIdAndCartCartId(productId, cartId);

        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart.");
        }

        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setDiscount(product.getDiscount());
        cartItemRepo.save(cartItem);
    }

    private CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        
        List<ProductInCartDTO> products = new ArrayList<>();
        double totalPrice = 0;
        
        for (CartItem item : cart.getCartItems()) {
            ProductInCartDTO productDTO = new ProductInCartDTO();
            Product product = item.getProduct();
            
            productDTO.setProductId(product.getProductId());
            productDTO.setProductName(product.getProductName());
            productDTO.setPrice(product.getPrice());
            productDTO.setDiscount(product.getDiscount());
            productDTO.setCartQuantity(item.getQuantity());
            productDTO.setImage(product.getImage());
            
            double itemPrice = product.getPrice() * item.getQuantity();
            if (product.getDiscount() > 0) {
                itemPrice = itemPrice * (1 - product.getDiscount()/100.0);
            }
            totalPrice += itemPrice;
            products.add(productDTO);
        }
        
        dto.setProducts(products);
        dto.setTotalPrice(totalPrice);
        
        return dto;
    }

}
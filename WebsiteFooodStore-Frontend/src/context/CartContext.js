import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        cartId: null,
        totalPrice: 0,
        products: []
    });

    const fetchCartFromBackend = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');
            
            if (!userStr || !token) return;

            const user = JSON.parse(userStr);
            
            const response = await axios.get(
                `http://localhost:8080/api/public/users/${user.email}/carts/${user.GH.cartId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCartFromBackend();
    }, []);

    const addToCart = async (product, quantity) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');
            
            if (!userStr || !token) {
                toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
                return;
            }

            const user = JSON.parse(userStr);
      
            const response = await axios.post(
                `http://localhost:8080/api/public/carts/${user.GH.cartId}/products/${product.productId}/quantity/${quantity}`,
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setCart(response.data);
                toast.success('Đã thêm sản phẩm vào giỏ hàng!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng!');
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');
            
            if (!userStr || !token) return;

            const user = JSON.parse(userStr);

            if (newQuantity <= 0) {
                await removeFromCart(productId);
                return;
            }

            const response = await axios.put(
                `http://localhost:8080/api/public/carts/${user.GH.cartId}/products/${productId}/quantity/${newQuantity}`,
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Không thể cập nhật số lượng sản phẩm!');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');
            
            if (!userStr || !token) return;

            const user = JSON.parse(userStr);

            const response = await axios.delete(
                `http://localhost:8080/api/public/carts/${user.GH.cartId}/product/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                setCart(prevCart => ({
                    ...prevCart,
                    products: prevCart.products.filter(item => item.product.productId !== productId)
                }));
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Không thể xóa sản phẩm khỏi giỏ hàng!');
        }
    };

    const getTotalItems = () => {
        return cart.products.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            totalItems: getTotalItems()
        }}>
            {children}
        </CartContext.Provider>
    );
};
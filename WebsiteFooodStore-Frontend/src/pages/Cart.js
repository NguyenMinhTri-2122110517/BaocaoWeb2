import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('authToken');

            if (!user || !token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/public/users/${user.email}/carts/${user.GH.cartId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true,
                    maxRedirects: 0,
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                }
            );

            console.log('Cart Response:', response.data);

            if (response.data && response.data.products) {
                // Sử dụng cartQuantity từ response
                const mergedProducts = Object.values(
                    response.data.products.reduce((acc, current) => {
                        if (!acc[current.productId]) {
                            acc[current.productId] = {
                                ...current,
                                quantity: current.cartQuantity // Sử dụng cartQuantity từ DB
                            };
                        } else {
                            // Cập nhật quantity nếu sản phẩm đã tồn tại
                            acc[current.productId].quantity = current.cartQuantity;
                        }
                        return acc;
                    }, {})
                );

                console.log('Merged Products:', mergedProducts);
                setCartItems(mergedProducts);
            } else {
                setCartItems([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Fetch cart error:', error);
            toast.error('Không thể tải giỏ hàng!');
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('authToken');

            if (newQuantity < 1) {
                // Nếu số lượng < 1, xóa sản phẩm
                await handleRemoveItem(productId);
                return;
            }

            const response = await axios.put(
                `http://localhost:8080/api/public/carts/${user.GH.cartId}/products/${productId}/quantity/${newQuantity}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Đã cập nhật số lượng!');
                fetchCartItems(); // Tải lại giỏ hàng sau khi cập nhật
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error('Không thể cập nhật số lượng!');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('authToken');

            const response = await axios.delete(
                `http://localhost:8080/api/public/carts/${user.GH.cartId}/product/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
                fetchCartItems(); // Tải lại giỏ hàng sau khi xóa
            }
        } catch (error) {
            console.error('Remove item error:', error);
            toast.error('Không thể xóa sản phẩm!');
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }
        // Lưu thông tin giỏ hàng vào localStorage để Checkout có thể sử dụng
        localStorage.setItem('checkoutItems', JSON.stringify({
            items: cartItems,
            totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        }));
        navigate('/checkout');
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 30000; // Phí vận chuyển cố định
    const total = subtotal + shipping;

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Giỏ hàng của bạn</h1>
                
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <FaShoppingBag />
                        <h2>Giỏ hàng trống</h2>
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <button 
                            className="continue-shopping"
                            onClick={() => navigate('/')}
                        >
                            <FaArrowLeft /> Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.productId} className="cart-item">
                                        <div className="cart-item-image">
                                            <img 
                                                src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                                alt={item.productName} 
                                            />
                                        </div>
                                        <div className="cart-item-details">
                                            <h3>{item.productName}</h3>
                                            <div className="cart-item-price">
                                                <span className="current-price">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(item.price)}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span className="original-price">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.price * (1 + item.discount/100))}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="quantity-controls">
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button 
                                                    className="remove-item"
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                >
                                                    <FaTrash /> Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="col-lg-4">
                            <div className="cart-summary">
                                <h3>Tổng đơn hàng</h3>
                                <div className="summary-item">
                                    <span>Tạm tính</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(subtotal)}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span>Phí vận chuyển</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(shipping)}
                                    </span>
                                </div>
                                <div className="summary-item total">
                                    <span>Tổng cộng</span>
                                    <span className="total-price">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(total)}
                                    </span>
                                </div>
                                <button 
                                    className="checkout-button" 
                                    onClick={handleCheckout}
                                >
                                    Tiến hành thanh toán
                                </button>
                                <button 
                                    className="continue-shopping"
                                    onClick={() => navigate('/')}
                                >
                                    <FaArrowLeft /> Tiếp tục mua sắm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart; 
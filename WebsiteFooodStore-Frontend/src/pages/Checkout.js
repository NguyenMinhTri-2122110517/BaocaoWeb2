import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu từ localStorage
        const checkoutData = localStorage.getItem('checkoutItems');
        if (!checkoutData) {
            toast.error('Không có thông tin đơn hàng!');
            navigate('/cart');
            return;
        }

        try {
            const parsedData = JSON.parse(checkoutData);
            setOrderData(parsedData);
            setLoading(false);
        } catch (error) {
            console.error('Parse checkout data error:', error);
            toast.error('Lỗi khi xử lý thông tin đơn hàng!');
            navigate('/cart');
        }
    }, [navigate]);

    const handlePlaceOrder = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('authToken');

            if (!user || !token) {
                toast.error('Vui lòng đăng nhập để tiếp tục!');
                navigate('/login');
                return;
            }

            setLoading(true);
            const response = await axios.post(
                `http://localhost:8080/api/public/users/${user.email}/carts/${user.GH.cartId}/payments/${paymentMethod}/order`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                // Xóa dữ liệu checkout khỏi localStorage
                localStorage.removeItem('checkoutItems');
                toast.success('Đặt hàng thành công!');
                navigate('/orders'); // Chuyển đến trang đơn hàng
            }
        } catch (error) {
            console.error('Place order error:', error);
            toast.error(error.response?.data?.message || 'Không thể đặt hàng! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang xử lý...</div>;
    if (!orderData) return null;

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="checkout-summary">
                    <h2>Xác nhận đơn hàng</h2>
                    <div className="order-items">
                        {orderData.items.map(item => (
                            <div key={item.productId} className="order-item">
                                <img 
                                    src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                    alt={item.productName} 
                                />
                                <div className="item-info">
                                    <h3>{item.productName}</h3>
                                    <p className="quantity">Số lượng: {item.quantity}</p>
                                    <p className="price">${item.price}</p>
                                    <p className="subtotal">Thành tiền: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        <h3>Tổng cộng</h3>
                        <p className="total-amount">${orderData.totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div className="payment-section">
                    <h2>Phương thức thanh toán</h2>
                    <div className="payment-methods">
                        <label className="payment-method">
                            <input
                                type="radio"
                                value="CASH_ON_DELIVERY"
                                checked={paymentMethod === 'CASH_ON_DELIVERY'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="method-name">Thanh toán khi nhận hàng</span>
                        </label>
                        <label className="payment-method">
                            <input
                                type="radio"
                                value="CREDIT_CARD"
                                checked={paymentMethod === 'CREDIT_CARD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="method-name">Thẻ tín dụng</span>
                        </label>
                    </div>

                    <button 
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 
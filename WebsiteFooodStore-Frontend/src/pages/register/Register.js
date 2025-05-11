import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const userData = {
                email: email,
                password: password,
                firstName: "string",
                lastName: "string",
                mobileNumber: "0123456789",
                roles: [],
                address: {
                    street: "string",
                    buildingName: "string",
                    city: "string",
                    state: "string",
                    country: "string",
                    pincode: "string"
                }
            };

            const response = await axios.post('http://localhost:8080/api/register', userData);
            
            if (response.data['jwt-token']) {
                localStorage.setItem('authToken', response.data['jwt-token']);
                alert('Đăng ký thành công!');
                navigate('/login');
            }
        } catch (error) {
            setError('Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Đăng ký tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="register-button">
                        Đăng ký
                    </button>
                    <div className="additional-links">
                        <Link to="/login" className="login-link">
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 
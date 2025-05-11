import React, { useEffect, useState, useRef } from "react";
import { GET_ALL } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import us from "../assets/images/icons/flags/US.png";
import logo from "../assets/images/th.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import SearchBar from '../components/SearchBar';

function Header() {
    const { userName, updateUserName } = useUser();
    const [categories, setCategories] = useState([]);
    const navbarRef = useRef(null);
    const navigate = useNavigate();
    const { totalItems } = useCart();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            updateUserName(userData.firstName);
        }

        const fetchCategories = async () => {
            try {
                const params = {
                    pageNumber: 0,
                    pageSize: 5,
                    sortBy: 'categoryId',
                    sortOrder: 'asc',
                };

                const response = await GET_ALL('categories', params);
                if (response && response.content) {
                    setCategories(response.content);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [updateUserName]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        updateUserName('');
        navigate('/login');
    };

    return (
        <header className="section-header">
            <Navbar bg="light" expand="lg" ref={navbarRef}>
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                            <NavDropdown title="Danh sách sản phẩm" id="basic-nav-dropdown">
                                {categories.map((category) => (
                                    <NavDropdown.Item 
                                        key={category.categoryId}
                                        as={Link} 
                                        to={`/category/${category.id}`}
                                    >
                                        {category.name}
                                    </NavDropdown.Item>
                                ))}
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/products">
                                    Tất cả sản phẩm
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to="/products">Tất cả sản phẩm</Nav.Link>
                            <Nav.Link as={Link} to="/posts">Bài viết</Nav.Link>
                        </Nav>

                        {/* Thanh tìm kiếm */}
                        <div className="search-form">
                            <SearchBar />
                        </div>

                        {/* User section */}
                        <div className="user-section">
                            {userName ? (
                                <NavDropdown 
                                    title={<>
                                        <FaUser className="me-1" />
                                        {userName}
                                    </>} 
                                    id="user-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/profile">Tài khoản</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/orders">Đơn hàng</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Link to="/login" className="nav-link">
                                    <FaUser className="me-1" />
                                    Đăng nhập
                                </Link>
                            )}

                            {/* Giỏ hàng */}
                            <Link to="/cart" className="nav-link cart-icon">
                                <FaShoppingCart />
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </Link>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
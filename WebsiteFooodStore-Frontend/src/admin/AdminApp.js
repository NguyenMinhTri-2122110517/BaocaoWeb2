import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
    FaHome, 
    FaBox, 
    FaList, 
    FaImages, 
    FaChartLine, 
    FaNewspaper, 
    FaSignOutAlt,
    FaUserCircle,
    FaCog,
    FaBell
} from 'react-icons/fa';
import './AdminApp.css';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import CategoryList from './pages/CategoryList';
import CategoryCreate from './pages/CategoryCreate';
import CategoryEdit from './pages/CategoryEdit';
import BannerList from './pages/BannerList';
import BannerCreate from './pages/BannerCreate';
import BannerEdit from './pages/BannerEdit';
import ProductSaleList from './pages/ProductSaleList';
import ProductSaleCreate from './pages/ProductSaleCreate';
import ProductSaleEdit from './pages/ProductSaleEdit';
import PostManagement from './pages/PostManagement';

function AdminApp() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="nav-item">
                        <FaHome size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="nav-item">
                        <FaBox size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/admin/categories" className="nav-item">
                        <FaList size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/banners" className="nav-item">
                        <FaImages size={20} />
                        <span>Banners</span>
                    </Link>
                    <Link to="/admin/product-sales" className="nav-item">
                        <FaChartLine size={20} />
                        <span>Product Sales</span>
                    </Link>
                    <Link to="/admin/posts" className="nav-item">
                        <FaNewspaper size={20} />
                        <span>Posts</span>
                    </Link>
                </nav>
                <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt size={18} />
                    <span>Logout</span>
                </button>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h1>E-Commerce Admin</h1>
                    <div className="admin-header-actions">
                        <button className="btn-icon">
                            <FaBell size={20} />
                        </button>
                        <button className="btn-icon">
                            <FaUserCircle size={20} />
                        </button>
                        <button className="btn-icon">
                            <FaCog size={20} />
                        </button>
                    </div>
                </header>
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/create" element={<ProductCreate />} />
                        <Route path="/products/edit/:id" element={<ProductEdit />} />
                        <Route path="/categories" element={<CategoryList />} />
                        <Route path="/categories/create" element={<CategoryCreate />} />
                        <Route path="/categories/edit/:id" element={<CategoryEdit />} />
                        <Route path="/banners" element={<BannerList />} />
                        <Route path="/banners/create" element={<BannerCreate />} />
                        <Route path="/banners/edit/:id" element={<BannerEdit />} />
                        <Route path="/product-sales" element={<ProductSaleList />} />
                        <Route path="/product-sales/create" element={<ProductSaleCreate />} />
                        <Route path="/product-sales/edit/:id" element={<ProductSaleEdit />} />
                        <Route path="/posts" element={<PostManagement />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default AdminApp; 
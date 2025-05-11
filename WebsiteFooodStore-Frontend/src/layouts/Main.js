import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/home/SectionContent';
import ProductDetail from '../pages/ProductDetail';
import AllProducts from '../pages/AllProducts';
import Checkout from'../pages/Checkout';

import CategoryProducts from '../pages/CategoryProducts';
import Register from '../pages/register/Register';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Profile from '../pages/Profile';

function Main() {
    return (
        <main className="main-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Detail/:productId" element={<ProductDetail />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/category/:categoryId" element={<CategoryProducts />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </main>
    );
}

export default Main;
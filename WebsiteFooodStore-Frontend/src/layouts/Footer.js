import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content pt-5 pb-5">
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <div className="footer-widget">
                                <h3>Contact us</h3>
                                <div className="footer-contact-info">
                                    <p><i className="fas fa-map-marker-alt"></i> 542 Fake Street, Cityname 10021</p>
                                    <p><i className="fas fa-phone"></i> (800) 060-0730</p>
                                    <p><i className="fas fa-envelope"></i> info@example.com</p>
                                    <p><i className="fas fa-clock"></i> Mon-Sat 10:00pm - 7:00pm</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="footer-widget">
                                <h3>Information</h3>
                                <ul className="footer-links">
                                    <li><Link to="/about">About us</Link></li>
                                    <li><Link to="/career">Career</Link></li>
                                    <li><Link to="/store">Find a store</Link></li>
                                    <li><Link to="/rules">Rules and terms</Link></li>
                                    <li><Link to="/sitemap">Sitemap</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="footer-widget">
                                <h3>My Account</h3>
                                <ul className="footer-links">
                                    <li><Link to="/login">User Login</Link></li>
                                    <li><Link to="/register">User register</Link></li>
                                    <li><Link to="/account">Account Setting</Link></li>
                                    <li><Link to="/orders">My Orders</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="footer-widget">
                                <h3>Newsletter</h3>
                                <div className="footer-newsletter">
                                    <p>Subscribe to our newsletter for the latest updates</p>
                                    <form className="newsletter-form">
                                        <input type="email" placeholder="Enter your email" />
                                        <button type="submit" className="btn btn-primary">Subscribe</button>
                                    </form>
                                    <div className="social-links mt-3">
                                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                        <a href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <p className="copyright-text text-center">
                                © 2024 Your Company. All rights reserved
                            </p>
                        </div>
                      
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
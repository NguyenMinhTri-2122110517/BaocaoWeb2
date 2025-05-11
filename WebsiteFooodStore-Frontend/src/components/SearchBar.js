import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/public/products/keyword/${searchTerm}`, {
                    params: {
                        pageNumber: 0,
                        pageSize: 5,
                        sortBy: 'productName',
                        sortOrder: 'asc'
                    }
                });
                setSuggestions(response.data.content);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${searchTerm}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (product) => {
        navigate(`/Detail/${product.productId}`);
        setShowSuggestions(false);
    };

    return (
        <div className="search-bar-container" ref={searchRef}>
            <form onSubmit={handleSearch} className="search-form" autoComplete="off">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="search-input"
                />
                <button 
                    type="submit"
                    className="search-button"
                >
                    <FaSearch /> Tìm kiếm
                </button>
            </form>

            {showSuggestions && searchTerm.trim().length >= 2 && (
                <div className="search-suggestions">
                    {loading ? (
                        <div className="suggestion-loading">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <ul className="suggestions-list">
                            {suggestions.map(product => (
                                <li 
                                    key={product.productId}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(product)}
                                >
                                    <img 
                                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                                        alt={product.productName}
                                        className="suggestion-image"
                                    />
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">{product.productName}</div>
                                        <div className="suggestion-price">
                                            ${product.price}
                                            {product.discount > 0 && (
                                                <span className="suggestion-discount">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-suggestions">
                            Không tìm thấy sản phẩm phù hợp
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar; 
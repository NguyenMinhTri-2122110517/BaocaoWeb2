import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaFilter, FaSort, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './SearchResults.css';

const API_URL = 'http://localhost:8080/api';

const SearchResults = () => {
    const { keyword } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('productId');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchCategories();
        fetchSearchResults();
    }, [keyword, currentPage, sortBy, sortOrder, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/public/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/public/products/keyword/${keyword}`, {
                params: {
                    pageNumber: currentPage - 1,
                    pageSize: itemsPerPage,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    categoryId: selectedCategory
                }
            });
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setError('');
        } catch (error) {
            console.error('Error searching products:', error);
            setError('Không thể tìm kiếm sản phẩm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FaChevronLeft />
            </Pagination.Prev>
        );

        // First page
        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
            }
        }

        // Page numbers
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FaChevronRight />
            </Pagination.Next>
        );

        return items;
    };

    if (loading) {
        return (
            <div className="search-results-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <Container className="search-results-container">
            <div className="search-results-header">
                <h2>Kết quả tìm kiếm cho "{keyword}"</h2>
                <div className="search-controls">
                    <Button 
                        variant="outline-primary" 
                        onClick={() => setShowFilters(!showFilters)}
                        className="filter-toggle"
                    >
                        <FaFilter /> Bộ lọc
                    </Button>
                    <div className="sort-controls">
                        <select 
                            className="form-select" 
                            onChange={(e) => handleSort(e.target.value)}
                            value={sortBy}
                        >
                            <option value="productId">Sắp xếp theo ID</option>
                            <option value="productName">Sắp xếp theo tên</option>
                            <option value="price">Sắp xếp theo giá</option>
                        </select>
                        <Button 
                            variant="outline-secondary"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <FaSort /> {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                        </Button>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="filters-section">
                    <Form.Group className="mb-3">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                        >
                            <option value="0">Tất cả danh mục</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <Row className="search-results-grid">
                {products.map(product => (
                    <Col key={product.productId} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <div className="product-card">
                            <div className="product-image">
                                <Link to={`/Detail/${product.productId}`}>
                                    <img 
                                        src={`${API_URL}/public/products/image/${product.image}`}
                                        alt={product.productName}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300';
                                        }}
                                    />
                                </Link>
                                {product.discount > 0 && (
                                    <span className="discount-badge">-{product.discount}%</span>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">
                                    <Link to={`/Detail/${product.productId}`}>
                                        {product.productName}
                                    </Link>
                                </h3>
                                <div className="product-price">
                                    <span className="current-price">${product.price}</span>
                                    {product.discount > 0 && (
                                        <span className="original-price">
                                            ${(product.price * (100 + product.discount) / 100).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="product-category">
                                    {product.category.name}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {products.length === 0 && !error && (
                <div className="no-results">
                    <h3>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{keyword}"</h3>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-container">
                    <Pagination className="justify-content-center">
                        {renderPagination()}
                    </Pagination>
                    <div className="pagination-info">
                        Hiển thị {products.length} / {totalElements} sản phẩm
                    </div>
                </div>
            )}
        </Container>
    );
};

export default SearchResults; 
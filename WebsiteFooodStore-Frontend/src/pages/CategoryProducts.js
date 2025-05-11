import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GET_ALL } from '../api/apiService';
import './CategoryProducts.css';

const CategoryProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('productId');
    const [sortOrder, setSortOrder] = useState('asc');
    const [categoryName, setCategoryName] = useState('');
    const { categoryId } = useParams();

    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage, sortBy, sortOrder]);

    const fetchProducts = async () => {
        try {
            const response = await GET_ALL(`categories/${categoryId}/products`, {
                pageNumber: currentPage,
                pageSize: 12,
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            setProducts(response.content);
            setTotalPages(response.totalPages);
            // Lấy tên category từ sản phẩm đầu tiên
            if (response.content.length > 0) {
                setCategoryName(response.content[0].category.name);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
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
    };

    if (loading) return <div className="container mt-5 text-center">Loading...</div>;

    return (
        <div className="category-products">
            <div className="category-products-container">
                {/* Header Section */}
                <div className="products-header">
                    <h2>{categoryName}</h2>
                    <div className="sort-controls">
                        <select 
                            className="form-select" 
                            onChange={(e) => handleSort(e.target.value)}
                            value={sortBy}
                        >
                            <option value="productId">Sort by ID</option>
                            <option value="productName">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                        </select>
                        <button 
                            className="btn btn-outline-dark ms-2"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="row">
                    {products.map(product => (
                        <div key={product.productId} className="col-md-3 mb-4">
                            <div className="product-card">
                                <div className="product-image">
                                    <Link to={`/Detail/${product.productId}`}>
                                        <img 
                                            src={`http://localhost:8080/api/public/products/image/${product.image}`}
                                            alt={product.productName}
                                        />
                                    </Link>
                                    {product.discount > 0 && (
                                        <span className="discount-badge">-{product.discount}%</span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <Link to={`/Detail/${product.productId}`} className="product-name-link">
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
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="pagination-container">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li 
                                    key={index + 1} 
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button 
                                        className="page-link"
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default CategoryProducts; 

// Thêm styles mới
const styles = `
/* ... existing styles ... */

.product-title {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 10px;
}

.product-name-link {
    color: #333;
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s ease;
}

.product-name-link:hover {
    color: #e94560;
    text-decoration: none;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.current-price {
    font-size: 16px;
    font-weight: 600;
    color: #e94560;
}

.original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
}

.product-category {
    font-size: 12px;
    color: #666;
}

.product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-info {
    padding: 15px;
}
`; 
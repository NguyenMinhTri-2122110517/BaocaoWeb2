import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';

// Cấu hình axios
axios.defaults.baseURL = 'http://localhost:8080';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/public/products`, {
                params: {
                    pageNumber: currentPage + 1,
                    pageSize: pageSize,
                    sortBy: 'productId',
                    sortOrder: 'desc'
                }
            });
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setError('');
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            fetchProducts();
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`/api/public/products/keyword/${searchTerm}`, {
                params: {
                    pageNumber: currentPage + 1,
                    pageSize: pageSize,
                    sortBy: 'productId',
                    sortOrder: 'desc'
                }
            });
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setError('');
        } catch (error) {
            console.error('Error searching products:', error);
            setError('Failed to search products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/admin/products/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                setError('Failed to delete product. Please try again.');
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Products</h2>
                <Link to="/admin/products/create">
                    <Button variant="primary">Add New Product</Button>
                </Link>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary" type="submit">
                                <FaSearch /> Search
                            </Button>
                        </InputGroup>
                    </Form>
                </Card.Body>
            </Card>

            {error && <div className="alert alert-danger">{error}</div>}

            <Card>
                <Card.Body>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th className="text-center">Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.productId}>
                                    <td>{product.productId}</td>
                                    <td>
                                        <div className="d-flex gap-3 align-items-center" style={{ minWidth: '400px' }}>
                                            <img 
                                                src={`http://localhost:8080/api/public/products/image/${product.image}`}
                                                alt={product.productName}
                                                style={{ 
                                                    width: '100px', 
                                                    height: '100px', 
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    border: '1px solid #dee2e6',
                                                    padding: '4px',
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                            {product.image1 && (
                                                <img 
                                                    src={`http://localhost:8080/api/public/products/image/${product.image1}`}
                                                    alt={`${product.productName} - 1`}
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'contain',
                                                        borderRadius: '8px',
                                                        border: '1px solid #dee2e6',
                                                        padding: '4px',
                                                        backgroundColor: '#fff'
                                                    }}
                                                />
                                            )}
                                            {product.image2 && (
                                                <img 
                                                    src={`http://localhost:8080/api/public/products/image/${product.image2}`}
                                                    alt={`${product.productName} - 2`}
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'contain',
                                                        borderRadius: '8px',
                                                        border: '1px solid #dee2e6',
                                                        padding: '4px',
                                                        backgroundColor: '#fff'
                                                    }}
                                                />
                                            )}
                                            {product.image3 && (
                                                <img 
                                                    src={`http://localhost:8080/api/public/products/image/${product.image3}`}
                                                    alt={`${product.productName} - 3`}
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'contain',
                                                        borderRadius: '8px',
                                                        border: '1px solid #dee2e6',
                                                        padding: '4px',
                                                        backgroundColor: '#fff'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td>{product.productName}</td>
                                    <td>{product.category?.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.quantity}</td>
                                    <td className="text-center">
                                        <span className="badge bg-secondary">
                                            {product.totalReviews || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to={`/admin/products/edit/${product.productId}`}>
                                                <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                                    <FaEdit className="me-1" /> Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(product.productId)}
                                                className="d-flex align-items-center"
                                            >
                                                <FaTrash className="me-1" /> Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={currentPage === i}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default ProductList; 
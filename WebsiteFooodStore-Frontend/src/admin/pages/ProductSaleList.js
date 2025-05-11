import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductSaleList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/public/product-sales');
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales:', error);
            setError('Failed to load sales. Please try again.');
            setLoading(false);
        }
    };

    const handleDelete = async (saleId) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/product-sales/${saleId}`);
                fetchSales(); // Refresh the list
            } catch (error) {
                console.error('Error deleting sale:', error);
                setError('Failed to delete sale. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Sales</h2>
                <Link to="/admin/product-sales/create">
                    <Button variant="primary">Add New Sale</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Image</th>
                                <th>Original Price</th>
                                <th>Discount</th>
                                <th>Sale Price</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td>{sale.id}</td>
                                    <td>{sale.productName}</td>
                                    <td>
                                        <Image 
                                            src={`http://localhost:8080/api/public/products/image/${sale.productImage}`}
                                            alt={sale.productName}
                                            style={{ height: '50px' }}
                                        />
                                    </td>
                                    <td>${sale.originalPrice.toFixed(2)}</td>
                                    <td>{sale.discount}%</td>
                                    <td>${sale.salePrice.toFixed(2)}</td>
                                    <td>
                                        <div>From: {formatDate(sale.startDate)}</div>
                                        <div>To: {formatDate(sale.endDate)}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${sale.active ? 'bg-success' : 'bg-danger'}`}>
                                            {sale.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to={`/admin/product-sales/edit/${sale.id}`}>
                                                <Button variant="outline-primary" size="sm">Edit</Button>
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(sale.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center">No sales found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ProductSaleList; 
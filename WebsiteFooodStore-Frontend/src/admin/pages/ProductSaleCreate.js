import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductSaleCreate() {
    const navigate = useNavigate();
    const [sale, setSale] = useState({
        productId: '',
        discount: '',
        startDate: '',
        endDate: '',
        active: true
    });
    const [products, setProducts] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/public/products');
            // Get products from content array in the response
            setProducts(response.data.content || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "productId") {
            // Find the selected product from the products array
            const selectedProduct = products.find(p => p.productId === parseInt(value));
            if (selectedProduct) {
                setSale(prev => ({
                    ...prev,
                    productId: selectedProduct.productId
                }));
            }
        } else if (type === 'checkbox') {
            setSale(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setSale(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sale.productId) {
            setError('Please select a product');
            return;
        }
        if (sale.discount <= 0 || sale.discount > 100) {
            setError('Discount percentage must be between 0 and 100');
            return;
        }
        if (!sale.startDate || !sale.endDate) {
            setError('Please select both start and end dates');
            return;
        }
        if (new Date(sale.startDate) >= new Date(sale.endDate)) {
            setError('End date must be after start date');
            return;
        }

        setSaving(true);
        setError('');

        const formData = {
            productId: parseInt(sale.productId),
            discount: parseFloat(sale.discount),
            startDate: new Date(sale.startDate).toISOString(),
            endDate: new Date(sale.endDate).toISOString(),
            active: sale.active
        };

        try {
            await axios.post('http://localhost:8080/api/admin/product-sales', formData);
            navigate('/admin/product-sales');
        } catch (error) {
            console.error('Error creating sale:', error);
            setError(error.response?.data?.message || 'Failed to create sale. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Create New Product Sale</h2>
            
            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Product</Form.Label>
                            <Form.Select
                                name="productId"
                                value={sale.productId || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a product</option>
                                {Array.isArray(products) && products.map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName} - ${product.price}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Discount Percentage</Form.Label>
                            <Form.Control
                                type="number"
                                name="discount"
                                value={sale.discount}
                                onChange={handleChange}
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="Enter discount percentage (0-100)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startDate"
                                value={sale.startDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endDate"
                                value={sale.endDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="active"
                                checked={sale.active}
                                onChange={handleChange}
                                label="Active"
                            />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/admin/product-sales')}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Create Sale'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ProductSaleCreate; 
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ProductSaleEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sale, setSale] = useState({
        productId: '',
        discount: '',
        startDate: '',
        endDate: '',
        active: true
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                // Get all products first
                const productsResponse = await axios.get('http://localhost:8080/api/public/products');
                setProducts(productsResponse.data.content || []);

                // Get the sale details
                const saleResponse = await axios.get(`http://localhost:8080/api/public/product-sales/${id}`);
                const saleData = saleResponse.data;
                
                setSale({
                    productId: saleData.productId.toString(),
                    discount: saleData.discount.toString(),
                    startDate: saleData.startDate.slice(0, 16),
                    endDate: saleData.endDate.slice(0, 16),
                    active: saleData.active
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data. Please try again.');
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
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

        try {
            await axios.put(`http://localhost:8080/api/admin/product-sales/${id}`, {
                productId: parseInt(sale.productId),
                discount: parseFloat(sale.discount),
                startDate: sale.startDate,
                endDate: sale.endDate,
                active: sale.active
            });
            navigate('/admin/product-sales');
        } catch (error) {
            console.error('Error updating sale:', error);
            setError(error.response?.data?.message || 'Failed to update sale. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Edit Product Sale</h2>
            
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
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ProductSaleEdit; 
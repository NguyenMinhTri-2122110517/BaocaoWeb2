import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ProductEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        productName: '',
        description: '',
        price: '',
        quantity: '',
        discount: 0
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        image1: null,
        image2: null,
        image3: null
    });
    const [additionalPreviews, setAdditionalPreviews] = useState({
        image1: null,
        image2: null,
        image3: null
    });

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/public/products/${id}`);
            const productData = response.data;
            setProduct({
                productName: productData.productName,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                discount: productData.discount || 0
            });
            setSelectedCategory(productData.category?.id || '');
            setImagePreview(productData.imageUrl || '');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product. Please try again.');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/public/categories');
            setCategories(response.data.content || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: name === 'price' || name === 'quantity' || name === 'discount' 
                ? parseFloat(value) || 0 
                : value
        });
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAdditionalImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            setAdditionalImages(prev => ({
                ...prev,
                [imageKey]: file
            }));
            const previewUrl = URL.createObjectURL(file);
            setAdditionalPreviews(prev => ({
                ...prev,
                [imageKey]: previewUrl
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) {
            setError('Please select a category');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Prepare product data
            const productData = {
                productId: product.productId,
                productName: product.productName,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                discount: product.discount,
                categoryId: parseInt(selectedCategory)
            };

            console.log('Sending product data:', productData); // Debug log

            // First update the product details
            const response = await axios.put(`/api/admin/products/${id}`, productData);
            console.log('Update response:', response.data); // Debug log

            // Then update the main image if a new one was selected
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);
                await axios.put(`/api/admin/products/${id}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Update additional images if any are selected
            const hasAdditionalImages = Object.values(additionalImages).some(img => img !== null);
            if (hasAdditionalImages) {
                const additionalImagesForm = new FormData();
                if (additionalImages.image1) additionalImagesForm.append('image1', additionalImages.image1);
                if (additionalImages.image2) additionalImagesForm.append('image2', additionalImages.image2);
                if (additionalImages.image3) additionalImagesForm.append('image3', additionalImages.image3);

                await axios.put(
                    `/api/admin/products/${id}/additional-images`,
                    additionalImagesForm,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            setError(error.response?.data?.message || 'Failed to update product. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Edit Product</h2>
            
            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        value={product.productName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Main Product Image</Form.Label>
                            <div className="d-flex align-items-center gap-3">
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img 
                                            src={imagePreview} 
                                            alt="Product preview" 
                                            style={{ 
                                                width: '100px', 
                                                height: '100px', 
                                                objectFit: 'contain',
                                                borderRadius: '4px',
                                                border: '1px solid #dee2e6',
                                                padding: '4px',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    </div>
                                )}
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <Form.Text className="text-muted">
                                Select a new image to update the main product image
                            </Form.Text>
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={12}>
                                <h5>Additional Images</h5>
                            </Col>
                            {['image1', 'image2', 'image3'].map((imageKey, index) => (
                                <Col md={4} key={imageKey}>
                                    <Form.Group>
                                        <Form.Label>Image {index + 1}</Form.Label>
                                        <div className="d-flex align-items-center gap-3">
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleAdditionalImageChange(e, imageKey)}
                                            />
                                            {additionalPreviews[imageKey] && (
                                                <img 
                                                    src={additionalPreviews[imageKey]} 
                                                    alt={`Preview ${index + 1}`} 
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'contain',
                                                        borderRadius: '4px',
                                                        border: '1px solid #dee2e6',
                                                        padding: '4px',
                                                        backgroundColor: '#fff'
                                                    }} 
                                                />
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                        
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (VND)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Discount (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="discount"
                                        value={product.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mt-3">
                            {product.price && product.discount > 0 && (
                                <Alert variant="info">
                                    Special Price: {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price - (product.price * (product.discount / 100)))}
                                </Alert>
                            )}
                        </div>
                        
                        <div className="d-flex justify-content-between mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/admin/products')}
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

export default ProductEdit; 
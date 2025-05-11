import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductCreate() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        productName: '',
        description: '',
        price: '',
        quantity: '',
        discount: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
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

    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value);
        setSelectedCategory(categoryId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        console.log('Current product state:', product);
        console.log('Selected category:', selectedCategory);

        // Validate required fields
        if (!product.productName.trim()) {
            setError('Product name is required');
            return;
        }
        if (!product.description.trim()) {
            setError('Description is required');
            return;
        }
        if (!product.price || product.price <= 0) {
            setError('Price must be greater than 0');
            return;
        }
        if (!product.quantity || product.quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        if (!selectedCategory) {
            setError('Please select a category');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // First create the product
            const productData = {
                productName: product.productName.trim(),
                description: product.description.trim(),
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity),
                discount: parseFloat(product.discount) || 0,
                categoryId: parseInt(selectedCategory)
            };

            console.log('Creating product with data:', productData);

            const productResponse = await axios.post(
                `/api/admin/categories/${selectedCategory}/products`, 
                productData
            );

            console.log('Product created successfully:', productResponse.data);

            const productId = productResponse.data.productId;

            // Upload main image if selected
            if (imageFile) {
                console.log('Uploading main image...');
                const mainImageForm = new FormData();
                mainImageForm.append('image', imageFile);
                try {
                    await axios.put(
                        `/api/admin/products/${productId}/image`,
                        mainImageForm,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    console.log('Main image uploaded successfully');
                } catch (imageError) {
                    console.error('Error uploading main image:', imageError);
                    setError('Product created but failed to upload main image. Please try uploading the image again.');
                    setLoading(false);
                    return;
                }
            }

            // Upload additional images if any are selected
            const hasAdditionalImages = Object.values(additionalImages).some(img => img !== null);
            if (hasAdditionalImages) {
                console.log('Uploading additional images...');
                const additionalImagesForm = new FormData();
                if (additionalImages.image1) additionalImagesForm.append('image1', additionalImages.image1);
                if (additionalImages.image2) additionalImagesForm.append('image2', additionalImages.image2);
                if (additionalImages.image3) additionalImagesForm.append('image3', additionalImages.image3);

                try {
                    await axios.put(
                        `/api/admin/products/${productId}/additional-images`,
                        additionalImagesForm,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    console.log('Additional images uploaded successfully');
                } catch (additionalImagesError) {
                    console.error('Error uploading additional images:', additionalImagesError);
                    setError('Product created but failed to upload additional images. Please try uploading the images again.');
                    setLoading(false);
                    return;
                }
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || 'Failed to create product. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Add New Product</h2>
            
            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit} noValidate>
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
                                        isInvalid={error && !product.productName.trim()}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Product name is required
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        required
                                        isInvalid={error && !selectedCategory}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a category
                                    </Form.Control.Feedback>
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
                                isInvalid={error && !product.description.trim()}
                            />
                            <Form.Control.Feedback type="invalid">
                                Description is required
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Main Product Image</Form.Label>
                                    <div className="d-flex align-items-center gap-3">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
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
                        </Row>

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
                                        isInvalid={error && (!product.price || product.price <= 0)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Price must be greater than 0
                                    </Form.Control.Feedback>
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
                                        isInvalid={error && (!product.quantity || product.quantity <= 0)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Quantity must be greater than 0
                                    </Form.Control.Feedback>
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
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Create button clicked');
                                    handleSubmit(e);
                                }}
                              
                            >
                                Create Product
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ProductCreate; 
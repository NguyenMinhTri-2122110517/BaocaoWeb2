import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BannerCreate() {
    const navigate = useNavigate();
    const [banner, setBanner] = useState({
        name: '',
        active: false
    });
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBanner({
            ...banner,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // First create the banner
            const bannerResponse = await axios.post('http://localhost:8080/api/admin/banners', {
                name: banner.name,
                active: banner.active
            });

            // Then upload the image
            const formData = new FormData();
            formData.append('image', image);

            await axios.put(`http://localhost:8080/api/admin/banners/${bannerResponse.data.id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/admin/banners');
        } catch (error) {
            console.error('Error creating banner:', error);
            setError(error.response?.data?.message || 'Failed to create banner. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Create New Banner</h2>
            
            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Banner Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={banner.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter banner name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            {imagePreview && (
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="mt-2"
                                    style={{ maxHeight: '200px' }}
                                />
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="active"
                                checked={banner.active}
                                onChange={handleChange}
                                label="Active"
                            />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/admin/banners')}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Create Banner'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default BannerCreate; 
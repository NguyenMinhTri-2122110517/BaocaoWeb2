import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CategoryEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState({
        categoryName: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/public/categories/${id}`);
            setCategory({
                categoryName: response.data.name
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching category:', error);
            setError('Failed to load category. Please try again.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (category.categoryName.length < 5) {
            setError('Category name must contain at least 5 characters');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await axios.put(`http://localhost:8080/api/admin/categories/${id}`, category);
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            setError(error.response?.data?.message || 'Failed to update category. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="mb-4">Edit Category</h2>
            
            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="categoryName"
                                value={category.categoryName}
                                onChange={handleChange}
                                required
                                minLength={5}
                                placeholder="Enter category name (minimum 5 characters)"
                            />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/admin/categories')}
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

export default CategoryEdit; 
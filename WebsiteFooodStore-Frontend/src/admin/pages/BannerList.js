import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/public/banners');
            setBanners(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching banners:', error);
            setError('Failed to load banners. Please try again.');
            setLoading(false);
        }
    };

    const handleDelete = async (bannerId) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/banners/${bannerId}`);
                fetchBanners(); // Refresh the list
            } catch (error) {
                console.error('Error deleting banner:', error);
                setError('Failed to delete banner. Please try again.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Banners</h2>
                <Link to="/admin/banners/create">
                    <Button variant="primary">Add New Banner</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.id}>
                                    <td>{banner.id}</td>
                                    <td>{banner.name}</td>
                                    <td>
                                        <Image 
                                            src={`http://localhost:8080/api/public/banners/image/${banner.image}`}
                                            alt={banner.name}
                                            style={{ height: '50px' }}
                                        />
                                    </td>
                                    <td>
                                        <span className={`badge ${banner.active ? 'bg-success' : 'bg-danger'}`}>
                                            {banner.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to={`/admin/banners/edit/${banner.id}`}>
                                                <Button variant="outline-primary" size="sm">Edit</Button>
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(banner.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">No banners found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default BannerList; 
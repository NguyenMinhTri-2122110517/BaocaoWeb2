import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePost.css';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';

function CreatePost() {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        content: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        if (!authToken || !userStr) {
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user.userId) {
                navigate('/login');
                return;
            }
        } catch (err) {
            navigate('/login');
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }, [navigate]);

    const handleContentChange = (e) => {
        setPost({
            ...post,
            content: e.target.value
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setPost({
                ...post,
                image: file
            });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const authToken = localStorage.getItem('authToken');
            const userStr = localStorage.getItem('user');
            
            if (!authToken || !userStr) {
                navigate('/login');
                return;
            }

            const user = JSON.parse(userStr);
            
            if (!user.userId) {
                setError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
                navigate('/login');
                return;
            }

            const postResponse = await axios.post(`http://localhost:8080/api/posts/user/${user.userId}`, {
                content: post.content
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (post.image) {
                const formData = new FormData();
                formData.append('image', post.image);

                await axios.put(`http://localhost:8080/api/posts/${postResponse.data.id}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
            }

            setSuccess('Bài viết đã được gửi và đang chờ duyệt!');
            setPost({ content: '', image: null });
            setPreview(null);

            setTimeout(() => {
                navigate('/posts');
            }, 2000);

        } catch (err) {
            console.error('Error submitting post:', err);
            if (err.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng bài.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="create-post-container py-5">
            <Card className="create-post-card">
                <Card.Header className="text-center bg-gradient">
                    <h4 className="mb-0">Đăng bài viết mới</h4>
                </Card.Header>
                <Card.Body className="p-4">
                    {error && (
                        <Alert variant="danger" className="d-flex align-items-center">
                            <FaTimes className="me-2" />
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" className="d-flex align-items-center">
                            <i className="fas fa-check-circle me-2"></i>
                            {success}
                        </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="h6">Nội dung bài viết</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={post.content}
                                onChange={handleContentChange}
                                placeholder="Chia sẻ suy nghĩ của bạn..."
                                className="post-content-input"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="h6 d-flex align-items-center">
                                <FaImage className="me-2" />
                                Hình ảnh
                            </Form.Label>
                            <div 
                                className={`image-upload-container ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="image-input"
                                />
                                {!preview && (
                                    <div className="upload-placeholder">
                                        <FaUpload className="upload-icon" />
                                        <p className="upload-text">Kéo thả hoặc click để chọn ảnh</p>
                                        <p className="upload-hint">Hỗ trợ: JPG, PNG, GIF</p>
                                    </div>
                                )}
                            </div>
                        </Form.Group>

                        {preview && (
                            <div className="preview-container mb-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="preview-image"
                                />
                                <Button 
                                    variant="link" 
                                    className="remove-image"
                                    onClick={() => {
                                        setPreview(null);
                                        setPost({...post, image: null});
                                    }}
                                >
                                    <FaTimes />
                                </Button>
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/posts')}
                                className="px-4"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="px-4 btn-gradient"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Đang đăng...
                                    </>
                                ) : 'Đăng bài'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CreatePost; 
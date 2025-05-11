import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Nav, Badge } from 'react-bootstrap';
import axios from 'axios';

function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        try {
            const endpoint = activeTab === 'pending' 
                ? '/api/admin/posts/pending'
                : '/api/admin/posts/approved';
            
            const response = await axios.get(`http://localhost:8080${endpoint}`);
            setPosts(response.data);
        } catch (err) {
            setError('Không thể tải danh sách bài viết.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/posts/${postId}/approve`);
            fetchPosts();
        } catch (err) {
            setError('Không thể duyệt bài viết.');
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${postId}`);
                fetchPosts();
            } catch (err) {
                setError('Không thể xóa bài viết.');
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <h2 className="mb-4">Quản lý bài viết</h2>

            <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'pending'}
                        onClick={() => setActiveTab('pending')}
                    >
                        Chờ duyệt
                        {activeTab === 'pending' && posts.length > 0 && (
                            <Badge bg="danger" className="ms-2">
                                {posts.length}
                            </Badge>
                        )}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'approved'}
                        onClick={() => setActiveTab('approved')}
                    >
                        Đã duyệt
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {error && <div className="alert alert-danger">{error}</div>}

            <Card>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người đăng</th>
                                <th>Nội dung</th>
                                <th>Hình ảnh</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.userName}</td>
                                    <td>{post.content}</td>
                                    <td>
                                        {post.image && (
                                            <img
                                            src={`http://localhost:8080/api/public/posts/image/${post.image}`}
                                                alt="Post"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {activeTab === 'pending' && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleApprove(post.id)}
                                                >
                                                    Duyệt
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {posts.length === 0 && (
                        <div className="text-center py-3">
                            <p className="mb-0">
                                {activeTab === 'pending' 
                                    ? 'Không có bài viết nào đang chờ duyệt.'
                                    : 'Không có bài viết nào đã được duyệt.'}
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default PostManagement; 
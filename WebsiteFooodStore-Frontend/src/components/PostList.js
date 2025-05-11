import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';
import axios from 'axios';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts');
            setPosts(response.data);
        } catch (err) {
            setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div>
            {posts.map(post => (
                <Card key={post.id} className="mb-4">
                    <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                            <div className="me-3">
                                <Image
                                    src={`https://ui-avatars.com/api/?name=${post.userName}&background=random`}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div>
                                <h6 className="mb-0">{post.userName}</h6>
                                <small className="text-muted">
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </small>
                            </div>
                        </div>
                        
                        <Card.Text>{post.content}</Card.Text>
                        
                        {post.image && (
                            <div className="mb-3">
                                <img
                                    src={`http://localhost:8080/api/public/posts/image/${post.image}`}
                                    alt="Post"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '500px',
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/500x300?text=Image+Not+Found';
                                    }}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ))}
            
            {posts.length === 0 && (
                <Card>
                    <Card.Body className="text-center">
                        <p className="mb-0">Chưa có bài viết nào.</p>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default PostList; 
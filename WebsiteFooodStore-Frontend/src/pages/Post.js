import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Post.css';
import { FaUser, FaClock, FaHeart, FaRegHeart, FaComment, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import Comments from '../components/Comments';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiking, setIsLiking] = useState(false);
    const [reload, setReload] = useState(false);
    const [openComments, setOpenComments] = useState({});
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // Cập nhật nội dung bài viết
            await axios.put(
                `http://localhost:8080/api/posts/${editingPost.id}`,
                { content: editingPost.content },
                { headers }
            );

            // Nếu có ảnh mới, upload ảnh
            if (editingPost.newImage) {
                const formData = new FormData();
                formData.append('image', editingPost.newImage);

                await axios.put(
                    `http://localhost:8080/api/posts/${editingPost.id}/image`,
                    formData,
                    {
                        headers: {
                            ...headers,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            // Đóng form edit
            setEditingPost(null);
            
            // Load lại danh sách bài viết
            setReload(prev => !prev);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Không thể cập nhật bài viết. Vui lòng thử lại sau.');
        }
    };

    const handleEditPost = (post) => {
        setEditingPost({
            ...post,
            newImage: null,
            imagePreview: post.image ? `http://localhost:8080/api/public/posts/image/${post.image}` : null
        });
        setOpenActionMenu(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditingPost(prev => ({
                ...prev,
                newImage: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

        try {
            const authToken = localStorage.getItem('authToken');
            const headers = {
                'Authorization': `Bearer ${authToken}`
            };
            await axios.delete(`http://localhost:8080/api/posts/${postId}`, { headers });
            setPosts(posts.filter(p => p.id !== postId));
            setOpenActionMenu(null);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Không thể xóa bài viết. Vui lòng thử lại sau.');
        }
    };

    // Load trạng thái like và số lượng comment khi component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/posts');
                
                // Lấy trạng thái like từ localStorage
                const likedPostsStr = localStorage.getItem('likedPosts');
                const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : {};
                
                // Lấy số lượng comment cho mỗi bài viết
                const postsWithData = await Promise.all(response.data.map(async post => {
                    try {
                        const commentsResponse = await axios.get(`http://localhost:8080/api/comments/post/${post.id}`);
                        return {
                            ...post,
                            likedByCurrentUser: Boolean(likedPosts[post.id]),
                            commentCount: commentsResponse.data.length
                        };
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.id}:`, error);
                        return {
                            ...post,
                            likedByCurrentUser: Boolean(likedPosts[post.id]),
                            commentCount: 0
                        };
                    }
                }));
                
                setPosts(postsWithData);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [reload]);

    // Lưu trạng thái like vào localStorage khi posts thay đổi
    useEffect(() => {
        if (posts.length > 0) {
            const likedPosts = {};
            posts.forEach(post => {
                if (post.likedByCurrentUser) {
                    likedPosts[post.id] = true;
                }
            });
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }
    }, [posts]);

    const handleLikeClick = async (event, postId) => {
        event.stopPropagation();
        if (isLiking) return;

        try {
            setIsLiking(true);
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            if (!user || !user.userId) {
                navigate('/login');
                return;
            }
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            const post = posts.find(p => p.id === postId);
            if (!post.likedByCurrentUser) {
                // Like post
                const response = await axios.post(
                    `http://localhost:8080/api/users/${user.userId}/posts/${postId}/like`,
                    {},
                    { headers }
                );

                if (response.status === 200) {
                    // Cập nhật state và localStorage
                    setPosts(prevPosts => prevPosts.map(p =>
                        p.id === postId
                            ? { ...p, likeCount: (p.likeCount || 0) + 1, likedByCurrentUser: true }
                            : p
                    ));

                    // Cập nhật localStorage ngay lập tức
                    const likedPostsStr = localStorage.getItem('likedPosts');
                    const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : {};
                    likedPosts[postId] = true;
                    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
                }
            } else {
                // Unlike post
                const response = await axios.delete(
                    `http://localhost:8080/api/users/${user.userId}/posts/${postId}/like`,
                    { headers }
                );

                if (response.status === 200) {
                    // Cập nhật state và localStorage
                    setPosts(prevPosts => prevPosts.map(p =>
                        p.id === postId
                            ? { ...p, likeCount: Math.max((p.likeCount || 0) - 1, 0), likedByCurrentUser: false }
                            : p
                    ));

                    // Cập nhật localStorage ngay lập tức
                    const likedPostsStr = localStorage.getItem('likedPosts');
                    const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : {};
                    delete likedPosts[postId];
                    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentClick = (event, postId) => {
        event.stopPropagation();
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleCommentCountChange = (postId, count) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId
                ? { ...post, commentCount: count }
                : post
        ));
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải bài viết...</p>
        </div>
    );

    return (
        <div className="posts-container">
            {editingPost && (
                <div className="edit-post-modal">
                    <div>
                        <h2>Chỉnh sửa bài viết</h2>
                        <form className="edit-post-form" onSubmit={handleUpdatePost}>
                            <textarea 
                                value={editingPost.content}
                                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                className="edit-textarea"
                                placeholder="Bạn đang nghĩ gì?"
                            />
                            
                            <div className="edit-image-section">
                                <label>
                                    <span>Thêm/Đổi ảnh</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => document.querySelector('input[type="file"]').click()}
                                    >
                                        Chọn ảnh
                                    </button>
                                </label>
                                
                                {(editingPost.imagePreview || editingPost.newImage) && (
                                    <div className="edit-image-preview">
                                        <img 
                                            src={editingPost.imagePreview || URL.createObjectURL(editingPost.newImage)}
                                            alt="Preview"
                                        />
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() => setEditingPost({
                                                ...editingPost,
                                                newImage: null,
                                                imagePreview: null
                                            })}
                                            style={{ marginTop: '8px' }}
                                        >
                                            Xóa ảnh
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="modal-buttons">
                                <button 
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="cancel-button"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="save-button"
                                    disabled={!editingPost.content.trim() && !editingPost.newImage}
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="container">
                <div className="fb-create-post-wrapper">
                    <CreatePost onPostCreated={() => setReload(r => !r)} />
                </div>
                <div className="posts-feed">
                    {posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <div className="user-avatar">
                                        <FaUser className="avatar-icon" />
                                    </div>
                                    <div className="user-details">
                                        <h3 className="user-name">{post.userName || 'Anonymous'}</h3>
                                        <span className="post-time">
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                                <div className="post-actions" ref={menuRef}>
                                    <FaEllipsisH 
                                        className="action-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenActionMenu(openActionMenu === post.id ? null : post.id);
                                        }}
                                    />
                                    {openActionMenu === post.id && (
                                        <div className="action-menu">
                                            <button 
                                                onClick={() => handleEditPost(post)}
                                                className="menu-button"
                                            >
                                                <FaEdit className="menu-icon" /> Sửa bài viết
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="menu-button delete"
                                            >
                                                <FaTrash className="menu-icon" /> Xóa bài viết
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="post-content">
                                <p className="post-text">{post.content}</p>
                                {post.image && (
                                    <div className="post-image fb-post-image">
                                        <img 
                                            src={`http://localhost:8080/api/public/posts/image/${post.image}`}
                                            alt={post.content}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="post-stats">
                                <div className="stats-info">
                                    <div className="likes-count">
                                        <FaHeart className="like-icon" />
                                        <span>{post.likeCount || 0} lượt thích</span>
                                    </div>
                                    <div className="comments-count">
                                        <span>{post.commentCount || 0} bình luận</span>
                                    </div>
                                </div>
                                <div className="post-actions-buttons">
                                    <button 
                                        className={`action-button like-button ${post.likedByCurrentUser ? 'liked' : ''}`}
                                        onClick={(e) => handleLikeClick(e, post.id)}
                                    >
                                        {post.likedByCurrentUser ? <FaHeart /> : <FaRegHeart />}
                                        <span>Thích</span>
                                    </button>
                                    <button 
                                        className="action-button comment-button"
                                        onClick={(e) => handleCommentClick(e, post.id)}
                                    >
                                        <FaComment />
                                        <span>Bình luận</span>
                                    </button>
                                </div>
                            </div>
                            <Comments 
                                postId={post.id} 
                                isOpen={openComments[post.id]} 
                                onCommentCountChange={handleCommentCountChange}
                            />
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;
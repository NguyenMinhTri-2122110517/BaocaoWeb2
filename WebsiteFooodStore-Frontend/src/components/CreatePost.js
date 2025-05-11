import React, { useState } from 'react';
import { FaUser, FaImage } from 'react-icons/fa';
import './CreatePost.css';
import axios from 'axios';

function CreatePost({ onPostCreated }) {
    const [post, setPost] = useState({
        content: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleContentChange = (e) => {
        setPost({
            ...post,
            content: e.target.value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setPost({
                ...post,
                image: e.target.files[0]
            });
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            if (!user || !user.userId) {
                throw new Error('Vui lòng đăng nhập để đăng bài!');
            }
            const postResponse = await axios.post(`http://localhost:8080/api/posts/user/${user.userId}`, {
                content: post.content
            });
            if (post.image) {
                const formData = new FormData();
                formData.append('image', post.image);
                await axios.put(`http://localhost:8080/api/posts/${postResponse.data.id}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            setSuccess('Bài viết đã được gửi và đang chờ duyệt!');
            setPost({ content: '', image: null });
            setPreview(null);
            if (onPostCreated) onPostCreated();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đăng bài.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fb-create-post">
            <div className="fb-create-header">
                <div className="fb-avatar">
                    <FaUser />
                </div>
                <form className="fb-create-form" onSubmit={handleSubmit}>
                    <input
                        className="fb-create-input"
                        type="text"
                        value={post.content}
                        onChange={handleContentChange}
                        placeholder="Bạn đang nghĩ gì?"
                        required
                        maxLength={255}
                    />
                    {preview && (
                        <div className="fb-create-preview">
                            <img src={preview} alt="Preview" />
                        </div>
                    )}
                    <div className="fb-create-actions">
                        <label className="fb-create-image-btn">
                            <FaImage />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            Ảnh
                        </label>
                        <button
                            type="submit"
                            className="fb-create-submit"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng...' : 'Đăng'}
                        </button>
                    </div>
                    {error && <div className="fb-create-error">{error}</div>}
                    {success && <div className="fb-create-success">{success}</div>}
                </form>
            </div>
        </div>
    );
}

export default CreatePost; 
import React, { useState, useEffect } from 'react';
import { FaUser, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import './Comments.css';

function Comments({ postId, isOpen, onCommentCountChange }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, postId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
            setComments(response.data);
            if (onCommentCountChange) {
                onCommentCountChange(postId, response.data.length);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            if (!user || !user.userId) {
                throw new Error('Vui lòng đăng nhập để bình luận!');
            }

            await axios.post(`http://localhost:8080/api/comments/post/${user.userId}/${postId}`, {
                content: newComment
            });

            setNewComment('');
            await fetchComments();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gửi bình luận.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="comments-section">
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="comment-input-wrapper">
                    <div className="comment-avatar">
                        <FaUser />
                    </div>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        className="comment-input"
                    />
                    <button 
                        type="submit" 
                        className="comment-submit"
                        disabled={loading || !newComment.trim()}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                {error && <div className="comment-error">{error}</div>}
            </form>

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-avatar">
                            <FaUser />
                        </div>
                        <div className="comment-content">
                            <div className="comment-author">{comment.userName || 'Anonymous'}</div>
                            <div className="comment-text">{comment.content}</div>
                            <div className="comment-time">
                                {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comments; 
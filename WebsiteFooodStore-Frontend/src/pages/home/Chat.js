import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    text: "Hi! I'm AI ChatBot. How can I help you today?",
                    sender: 'AI CHAT',
                    isUser: false
                }
            ]);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const authToken = localStorage.getItem('authToken');
        if (!authToken || !user) return;

        try {
            setMessages(prev => [...prev, {
                text: newMessage,
                sender: user.firstName,
                isUser: true
            }]);

            const response = await axios.post('http://localhost:8080/api/ai/chat',
                newMessage,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            setMessages(prev => [...prev, {
                text: response.data,
                sender: 'AI CHAT',
                isUser: false
            }]);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!isOpen) {
        return (
            <button 
                className="chat-button"
                onClick={() => setIsOpen(true)}
            >
                Chat with AI
            </button>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="header-content">
                    <img 
                        src="/images/chatbot.avif" 
                        alt="AI ChatBot" 
                        className="chatbot-avatar"
                    />
                    <h3>AI Chat Assistant</h3>
                </div>
                <button 
                    className="close-button"
                    onClick={() => setIsOpen(false)}
                >
                    ×
                </button>
            </div>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
                    >
                        {!msg.isUser && (
                            <img 
                                src="/images/chatbot.avif" 
                                alt="AI ChatBot" 
                                className="message-avatar"
                            />
                        )}
                        <div className="message-content">
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {user ? (
                <form onSubmit={handleSubmit} className="input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                    />
                    <button type="submit" className="send-button">
                        Send
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    Please login to chat with AI
                </div>
            )}
        </div>
    );
};

export default Chat; 
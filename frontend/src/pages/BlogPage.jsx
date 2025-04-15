// frontend/src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import api from '../services/api';
import '../styles/Blog.css';
import '../styles/SharedStyles.css';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        subject: '',
        body: ''
    });
    const { user: currentUser, isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/community/blog/');
            setPosts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load blog posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!isAuthenticated() || !currentUser?.is_admin) {
            setError('You must be logged in as an admin to create posts.');
            return;
        }

        try {
            await api.post('/community/blog/', newPost);
            setNewPost({ title: '', subject: '', body: '' });
            setShowCreateForm(false);
            fetchPosts();
            setError(null);
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response?.status === 403) {
                setError('You do not have permission to create blog posts.');
            } else {
                setError(error.response?.data?.error || 'Failed to create blog post. Please try again later.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="blog-container">
                <h1>Sanctuary Space Blog</h1>
                <div className="loading">Loading blog posts...</div>
            </div>
        );
    }

    return (
        <div className="blog-container">
            <div className="bottom-image" />
            <h1>Sanctuary Space Blog</h1>
            
            {currentUser && currentUser.is_admin && (
                <div className="admin-controls">
                    {!showCreateForm ? (
                        <button 
                            className="create-post-btn"
                            onClick={() => setShowCreateForm(true)}
                        >
                            Create New Blog Post
                        </button>
                    ) : (
                        <div className="create-post-form">
                            <h2>Create New Blog Post</h2>
                            <form onSubmit={handleCreatePost}>
                                <div className="form-group">
                                    <label htmlFor="title">Title:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject:</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={newPost.subject}
                                        onChange={(e) => setNewPost({...newPost, subject: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="body">Body:</label>
                                    <textarea
                                        id="body"
                                        value={newPost.body}
                                        onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit">Create Post</button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCreateForm(false)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="blog-posts">
                {posts.map(post => (
                    <article key={post.id} className="blog-post">
                        <h2>{post.title}</h2>
                        <h3>{post.subject}</h3>
                        <p className="post-meta">
                            By {post.author.username} on {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <div className="post-body">{post.body}</div>
                    </article>
                ))}
                {posts.length === 0 && !error && (
                    <p className="no-posts">No blog posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default BlogPage;

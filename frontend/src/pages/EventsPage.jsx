import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import api from '../services/api';
import '../styles/Events.css';

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user: currentUser, isAuthenticated } = useAuth();
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: ''
    });

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/community/events/');
            setEvents(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!isAuthenticated() || !currentUser?.is_admin) {
            setError('You must be logged in as an admin to create events.');
            return;
        }

        try {
            await api.post('/community/events/', newEvent);
            setNewEvent({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                capacity: ''
            });
            setShowCreateForm(false);
            fetchEvents();
            setError(null);
        } catch (error) {
            console.error('Error creating event:', error);
            if (error.response?.status === 403) {
                setError('You do not have permission to create events.');
            } else {
                setError(error.response?.data?.error || 'Failed to create event. Please try again later.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="events-container">
                <h1>Community Events</h1>
                <div className="loading">Loading events...</div>
            </div>
        );
    }

    return (
        <div className="events-container">
            <h1>Community Events</h1>
            
            {currentUser && currentUser.is_admin && (
                <div className="admin-controls">
                    {!showCreateForm ? (
                        <button 
                            className="create-event-btn"
                            onClick={() => setShowCreateForm(true)}
                        >
                            Create New Event
                        </button>
                    ) : (
                        <div className="create-event-form">
                            <h2>Create New Event</h2>
                            <form onSubmit={handleCreateEvent}>
                                <div className="form-group">
                                    <label htmlFor="title">Title:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        id="description"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">Date:</label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="time">Time:</label>
                                    <input
                                        type="time"
                                        id="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location:</label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="capacity">Capacity:</label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        value={newEvent.capacity}
                                        onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit">Create Event</button>
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

            <div className="events-list">
                {events.map(event => (
                    <article key={event.id} className="event-card">
                        <h2>{event.title}</h2>
                        <p className="event-meta">
                            <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                            <span className="event-time">{event.time}</span>
                            <span className="event-location">{event.location}</span>
                        </p>
                        <p className="event-description">{event.description}</p>
                        <p className="event-capacity">Capacity: {event.capacity} people</p>
                    </article>
                ))}
                {events.length === 0 && !error && (
                    <p className="no-events">No upcoming events.</p>
                )}
            </div>
        </div>
    );
}

export default EventsPage;

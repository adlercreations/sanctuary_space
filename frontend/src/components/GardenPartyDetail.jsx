import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/Blog.css';

function GardenPartyDetail() {
  const [party, setParty] = useState(null);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const { id } = useParams();
  const { api, user } = useAuth();

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await api.get(`/api/garden-parties/${id}`);
        setParty(response.data);
        setIsRsvpd(response.data.attendees?.some(attendee => attendee.id === user?.id));
      } catch (error) {
        console.error('Error fetching garden party:', error);
      }
    };

    fetchParty();
  }, [api, id, user]);

  const handleRSVP = async () => {
    try {
      if (isRsvpd) {
        await api.delete(`/api/garden-parties/${id}/rsvp`);
        setIsRsvpd(false);
      } else {
        await api.post(`/api/garden-parties/${id}/rsvp`);
        setIsRsvpd(true);
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  if (!party) return <div>Loading...</div>;

  return (
    <div className="blog-post-container">
      <div className="blog-post-content">
        <img src={party.image_url} alt={party.title} className="featured-image" />
        <h1>{party.title}</h1>
        <div className="event-details">
          <p><strong>Date:</strong> {new Date(party.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {party.time}</p>
          <p><strong>Location:</strong> {party.location}</p>
          <p><strong>Available Spots:</strong> {party.capacity - party.attendee_count}</p>
        </div>
        <div className="event-description">
          <h2>About this Garden Party</h2>
          <p>{party.description}</p>
        </div>
        {party.tea_selection && (
          <div className="tea-selection">
            <h2>Featured Teas</h2>
            <p>{party.tea_selection}</p>
          </div>
        )}
        {user && (
          <button 
            className={`rsvp-button ${isRsvpd ? 'cancel' : ''}`}
            onClick={handleRSVP}
            disabled={!isRsvpd && party.capacity <= party.attendee_count}
          >
            {isRsvpd ? 'Cancel RSVP' : 'RSVP to Event'}
          </button>
        )}
      </div>
    </div>
  );
}

export default GardenPartyDetail;
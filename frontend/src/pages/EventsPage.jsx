import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EventsPage.css';

function EventsPage() {
  return (
    <div className="events-container">
      <div className="daytime-motif" />
      <div className="bottom-image" />
      <div className="events-top-content">
        <h1>Events</h1>
        <div className="events-content">
          <p>Join us for our special gatherings and experiences.</p>
        </div>
      </div>
      
      <div className="events-sections">
        <div className="event-section">
          <h2>Garden Parties</h2>
          <p>Experience our seasonal garden gatherings with tea tastings and mindful activities.</p>
          <Link to="/events/garden-parties" className="section-link">Party</Link>
        </div>
        
        <div className="event-section">
          <h2>Dinner Club</h2>
          <p>Join our intimate dinner experiences featuring seasonal, mindful dining.</p>
          <Link to="/events/dinner-club" className="section-link">Dine</Link>
        </div>
        
        <div className="event-section">
          <h2>Tea Club</h2>
          <p>Participate in our exclusive tea tasting events and enlightening ceremonies.</p>
          <Link to="/events/tea-club" className="section-link">Drink</Link>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;

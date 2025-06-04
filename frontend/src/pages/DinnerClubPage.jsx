import React from 'react';
import '../styles/EventsPage.css';

function DinnerClubPage() {
  return (
    <div className="events-container">
      <div className="daytime-motif" />
      <div className="bottom-image" />
      <div className="events-top-content">
        <h1>Dinner Club</h1>
        <div className="events-content">
          <p>Join us for intimate dining experiences featuring seasonal, mindful cuisine.</p>
        </div>
      </div>
      
      <div className="events-list">
        {/* This will be populated with actual dinner club events once we add them */}
        <p className="no-events">Upcoming dinner club events will be announced soon.</p>
      </div>
    </div>
  );
}

export default DinnerClubPage;

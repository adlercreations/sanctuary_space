import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/SharedStyles.css';

function GardenPartiesPage() {
  const [parties, setParties] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await api.get('/api/garden-parties');
        setParties(response.data);
      } catch (error) {
        console.error('Error fetching garden parties:', error);
      }
    };

    fetchParties();
  }, [api]);

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Sanctuary Space Garden Parties</h1>
        <div className="content-text">
          <div className="cards-grid">
            {parties.map((party) => (
              <Link to={`/garden-parties/${party.id}`} key={party.id} className="card">
                <img src={party.image_url} alt={party.title} className="card-image" />
                <div className="card-content">
                  <h3>{party.title}</h3>
                  <p className="date">{new Date(party.date).toLocaleDateString()}</p>
                  <p className="time">{party.time}</p>
                  <p className="location">{party.location}</p>
                  <p className="capacity">
                    Spots available: {party.capacity - party.attendee_count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="bottom-image"></div>
    </div>
  );
}

export default GardenPartiesPage;
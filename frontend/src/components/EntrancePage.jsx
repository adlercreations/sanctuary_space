// frontend/src/components/EntrancePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EntrancePage.css';

function EntrancePage() {
  const navigate = useNavigate();
  const [doorOpened, setDoorOpened] = useState(false);

  const handleDoorClick = () => {
    // Trigger door open animation
    setDoorOpened(true);

    // Delay the navigate to let the animation play
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="entrance-container">
      <div className="nighttime-overlay" />
      <div className="jungle-motif" />

      <div
        className={`arched-door ${doorOpened ? 'door-open' : ''}`}
        onClick={handleDoorClick}
      >
        <p>Enter Sanctuary Space</p>
      </div>

      <div className="entrance-hint">
        <p>Click the door to step inside...</p>
      </div>
    </div>
  );
}

export default EntrancePage;

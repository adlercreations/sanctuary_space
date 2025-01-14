// frontend/src/components/EntrancePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EntrancePage.css';

function EntrancePage() {
  const navigate = useNavigate();
  const [doorOpened, setDoorOpened] = useState(false);

  const handleDoorClick = () => {
    // Trigger door open animation, then navigate
    setDoorOpened(true);

    // Delay the navigate by, say, 1 second to let the animation play
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


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/EntrancePage.css'; // or inline styling

// function EntrancePage() {
//   const navigate = useNavigate();

//   const handleDoorClick = () => {
//     // Animate door open, then navigate
//     // For simplicity:
//     navigate('/home');
//   };

//   return (
//     <div className="entrance-container">
//       <div className="jungle-motif">
//         {/* Some stylized graphic or background image */}
//       </div>
//       <div className="arched-door" onClick={handleDoorClick}>
//         {/* The arched door could be an image or a div styled with border-radius */}
//         <p>Enter Sanctuary Space</p>
//       </div>
//     </div>
//   );
// }

// export default EntrancePage;
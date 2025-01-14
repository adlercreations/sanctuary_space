// frontend/src/pages/CommunityPage.jsx
import React from 'react';
import '../styles/CommunityPage.css';

function CommunityPage() {
  return (
    <div className="community-container">
      <div className="daytime-motif" />
      <h1>Community</h1>
      <div className="community-content">
        <p>Join our forum, read our blog, and check out upcoming events.</p>
        <p>We value your thoughts and ideas—share them here!</p>
      </div>
    </div>
  );
}

export default CommunityPage;



// // pages/CommunityPage.jsx
// import React from 'react';

// function CommunityPage() {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Community</h2>
//       <p>Forum, Blog, Upcoming Events</p>
//       {/* Link to separate forum components, etc. */}
//     </div>
//   );
// }

// export default CommunityPage;
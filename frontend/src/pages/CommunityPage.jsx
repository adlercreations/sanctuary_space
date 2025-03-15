// frontend/src/pages/CommunityPage.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Forum from '../components/forum/Forum';
import BlogPage from './BlogPage';
import EventsPage from './EventsPage';
import '../styles/CommunityPage.css';

function CommunityPage() {
  return (
    <div className="community-container">
      <div className="daytime-motif" />
      <div className="community-top-content">
        <h1>Community</h1>
        <div className="community-content">
          <p>Join our forum, read our blog, and check out upcoming events.</p>
          <p>We value your thoughts and ideas—share them here!</p>
        </div>
      </div>
      
      <Routes>
        <Route path="/forum/*" element={<Forum />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route 
          path="/" 
          element={
            <div className="community-sections">
              <div className="community-section">
                <h2>Forum</h2>
                <p>Join discussions with other community members about wellness, self-care, and more.</p>
                <Link to="/community/forum" className="section-link">Visit Forum</Link>
              </div>
              
              <div className="community-section">
                <h2>Blog</h2>
                <p>Read articles from our team and guest contributors about mindfulness and wellness.</p>
                <Link to="/community/blog" className="section-link">Read Blog</Link>
              </div>
              
              <div className="community-section">
                <h2>Events</h2>
                <p>Discover upcoming workshops, retreats, and community gatherings.</p>
                <Link to="/community/events" className="section-link">View Events</Link>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default CommunityPage;

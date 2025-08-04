import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../Components/UserProfile';
import Loader from '../Components/Loader';
import '../styles/Home.css';

const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/admin-dashboard');
    }, 1200); // Show loader for 1.2s for effect
  };

  return (
    <div className="home-container">
      {loading && <Loader />}
      <header className="home-header">
        <div className="home-logo">
          <span className="home-title">
            <span className="logo-solid">Style</span><span className="logo-hollow">Sphere</span>
          </span>
        </div>
        <UserProfile user={user} /> 
      </header>
      <main className="home-main">
        <h1 className="home-welcome">Welcome!</h1>
        <p className="home-desc">Manage your fashion store, view analytics, and control your inventory all in one place.</p>
        <button className="home-get-started" onClick={handleGetStarted} disabled={loading}>
          {loading ? "Loading..." : "Get Started"}
        </button>
      </main>
    </div>
  );
};

export default Home;
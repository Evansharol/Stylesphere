import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Loader from './Loader';

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  // ...existing code...
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.trim() || !password.trim()) {
      setMessage("Please enter both email and password");
      return;
    }
    // Get registered user from localStorage
    const regUser = JSON.parse(localStorage.getItem('user'));
    if (!regUser || regUser.email !== user || regUser.password !== password) {
      setMessage("Invalid credentials");
      return;
    }
    setMessage("");
    setShowLoader(true);
    
    // Store current logged-in user info separately
    localStorage.setItem('currentUser', JSON.stringify({
      name: regUser.name,
      email: regUser.email
    }));
    
    setTimeout(() => {
      setShowLoader(false);
      navigate("/home");
    }, 1200);
  };

  return (
    <div className="login-container">
      {showLoader && <Loader />}
      <div className="login-box">
        <div className="login-form-side">
          <h2 className="login-form-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-float-group">
              <input
                type="text"
                className="login-input floating-input"
                value={user}
                onChange={e => setUser(e.target.value)}
                autoComplete="off"
                required
              />
              <label className={`login-float-label${user ? ' filled' : ''}`}>Username or Email</label>
            </div>
            <div className="login-float-group">
              <input
                type="password"
                className="login-input floating-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="off"
                required
              />
              <label className={`login-float-label${password ? ' filled' : ''}`}>Password</label>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
            {message && <div style={{ color: 'red', marginTop: '8px', textAlign: 'center' }}>{message}</div>}
          </form>
        </div>
        <div className="login-welcome">
          <h1>You're right here!</h1>
          <p>
            Welcome back! Please sign in to continue and enjoy all the features of our platform.
          </p>
        </div>
        </div>
    </div>
  );
}

export default Login;
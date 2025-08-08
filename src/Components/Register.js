import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import '../styles/Register.css';


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showBox, setShowBox] = useState(false); // Start with false to show loader first
  const [showLoader, setShowLoader] = useState(true); // Add loader state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const nodeRef = useRef(null);
  const navigate = useNavigate();


  // Show loader on component mount, then show registration form
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowBox(true);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Save user to localStorage
  const saveUserToLocal = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim()) {
      setLoading(true);
      setMessage("");
      saveUserToLocal({ name, email, password });
      setShowBox(false);
      setTimeout(() => {
        navigate("/login");
      }, 500);
      alert("Registration successful! You can now log in.");
      setLoading(false);
    } else {
      setMessage("Please fill in all fields");
    }
  };



  return (
    <div className="register-container">
      {/* Show loader first */}
      {showLoader && <Loader />}
      
      {/* Elegant background animation */}
      <div className="shopping-background">
        <div className="floating-icon shopping-bag"></div>
        <div className="floating-icon shopping-cart"></div>
        <div className="floating-icon credit-card"></div>
        <div className="floating-icon gift-box"></div>
        <div className="floating-icon clothing"></div>
        <div className="floating-icon shoes"></div>
        <div className="floating-icon dress"></div>
        <div className="floating-icon jewelry"></div>
        <div className="floating-icon perfume"></div>
        <div className="floating-icon sunglasses"></div>
      </div>

      <CSSTransition
        in={showBox}
        timeout={400}
        classNames="fade-box"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div className="register-box" ref={nodeRef}>
          {/* Left Side - Welcome */}
          <div className="register-welcome">
            <h1>Welcome!</h1>
            <p>
              Register now to efficiently manage your fashion store. Gain access to exclusive inventory tools, sales analytics, and streamline your business operations with our professional platform.
            </p>
          </div>
          {/* Right Side - Register Form */}
          <div className="register-form-side">
            <h2 className="register-form-title">Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-float-group">
                <input
                  type="text"
                  className="register-input floating-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="off"
                  required
                />
                <label className={`register-float-label${name ? ' filled' : ''}`}>Name</label>
              </div>
              <div className="register-float-group">
                <input
                  type="email"
                  className="register-input floating-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
                <label className={`register-float-label${email ? ' filled' : ''}`}>Email</label>
              </div>
              <div className="register-float-group">
                <input
                  type="password"
                  className="register-input floating-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
                <label className={`register-float-label${password ? ' filled' : ''}`}>Password</label>
              </div>
              <button type="submit" className="register-btn" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
              {message && <div className="forgot-message">{message}</div>}
            </form>
            <div className="register-account-link">
              Already have an account?{' '}
              <span className="register-signin-link" onClick={() => {
                setShowBox(false);
                setTimeout(() => navigate('/login'), 500);
              }} tabIndex={0} role="button">Sign in</span>
            </div>
            <div className="register-or">or</div>
            <button className="register-social-btn register-google">Sign in with Google</button>
            <button className="register-social-btn register-facebook">Sign in with Facebook</button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Register
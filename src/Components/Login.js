import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Loader from './Loader';

function VerifyForgotOtpForm({ email, otp, setOtp, newPassword, setNewPassword, setShowForgot, setForgotStep, setMessage, loading, setLoading, message }) {
  const otpArr = Array.isArray(otp) ? otp : Array(6).fill('').map((_, i) => otp[i] || '');
  const otpRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, '');
    const newOtp = [...otpArr];
    newOtp[idx] = value[0] || '';
    setOtp(newOtp);
    if (value && idx < 5) otpRefs.current[idx + 1].current.focus();
  };
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpArr[idx] && idx > 0) otpRefs.current[idx - 1].current.focus();
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const otpValue = otpArr.join('');
    if (otpValue.length !== 6) {
      setMessage('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setShowForgot(false);
        setForgotStep(1);
        setMessage('');
        alert('Password reset successful');
      } else {
        setMessage(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setMessage('Server error');
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Verify OTP</h3>
      <label className="login-label">Enter OTP</label>
      <div className="otp-input-group">
        {otpArr.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input-box"
            value={digit}
            onChange={e => handleOtpChange(e, idx)}
            onKeyDown={e => handleOtpKeyDown(e, idx)}
            ref={otpRefs.current[idx]}
            autoFocus={idx === 0}
          />
        ))}
      </div>
      <div className="login-float-group">
        <input
          type="password"
          className="login-input floating-input"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <label className={`login-float-label${newPassword ? ' filled' : ''}`}>New Password</label>
      </div>
      <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Reset Password'}</button>
      {message && <div className="forgot-message">{message}</div>}
    </form>
  );
}

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
            <div className="login-forgot-link">
              <span tabIndex={0} role="button" onClick={() => setShowForgot(true)}>Forgot password?</span>
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

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="forgot-modal-bg">
          <div className="forgot-modal">
            <button className="forgot-close" onClick={() => { setShowForgot(false); setForgotStep(1); setMessage(""); }}>×</button>
            {forgotStep === 1 && (
              <form onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setMessage("");
                try {
                  const res = await fetch('http://localhost:5000/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: forgotEmail })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setForgotStep(2);
                    setMessage("OTP sent to your email");
                  } else {
                    setMessage(data.error || 'Failed to send OTP');
                  }
                } catch (err) {
                  setMessage('Server error');
                }
                setLoading(false);
              }}>
                <h3>Forgot Password</h3>
                <div className="login-float-group">
                  <input
                    type="email"
                    className="login-input floating-input"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                  <label className={`login-float-label${forgotEmail ? ' filled' : ''}`}>Email</label>
                </div>
                <button className="login-btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
                {message && <div className="forgot-message">{message}</div>}
              </form>
            )}
            {forgotStep === 2 && (
              <VerifyForgotOtpForm
                email={forgotEmail}
                otp={otp}
                setOtp={setOtp}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                setShowForgot={setShowForgot}
                setForgotStep={setForgotStep}
                setMessage={setMessage}
                loading={loading}
                setLoading={setLoading}
                message={message}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
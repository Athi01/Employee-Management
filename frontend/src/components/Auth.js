import React, { useState } from 'react';

const API_URL = 'http://localhost:8000/api';

function Auth({ onLogin, onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (isSignUp) {
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      const endpoint = `${API_URL}/auth.php`;
      const action = isSignUp ? 'signup' : 'signin';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignUp) {
          setSuccess('Account created successfully! Please sign in.');
          setIsSignUp(false);
          setFormData({ full_name: '', email: '', password: '', confirm_password: '' });
        } else {
          onLogin(data.user);
        }
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <button type="submit" className="btn-auth">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-switch">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setSuccess('');
          }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        
        <div className="auth-switch" style={{ marginTop: '10px' }}>
          <button onClick={onBack}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
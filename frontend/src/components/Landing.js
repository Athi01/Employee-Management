import React from 'react';

function Landing({ onNavigate }) {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>Employee Management System</h1>
        <p>
          Streamline your workforce management with our powerful and intuitive platform.
          Track, manage, and organize your employees efficiently.
        </p>
        <div className="landing-buttons">
          <button className="btn btn-primary" onClick={onNavigate}>
            Get Started
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default Landing;
import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Home from './components/Home';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, auth, home
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('home');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <Landing onNavigate={() => setCurrentView('auth')} />
      )}
      
      {currentView === 'auth' && (
        <Auth 
          onLogin={handleLogin}
          onBack={() => setCurrentView('landing')}
        />
      )}
      
      {currentView === 'home' && user && (
        <Home 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
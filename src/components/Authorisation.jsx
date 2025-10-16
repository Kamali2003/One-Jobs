import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

const Authorisation = ({ onClose, onLoginSuccess, initialUserType = 'jobseeker' }) => {
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState(initialUserType);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserType(user.type);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserType(user.type);
    onLoginSuccess(user.type, user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const handleRegisterSuccess = (user) => {
    setIsLoggedIn(true);
    setUserType(user.type);
    onLoginSuccess(user.type, user);
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  };

  const authModalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '450px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  };

  const modalCloseStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#888',
    cursor: 'pointer',
    zIndex: 10
  };

  if (isLoggedIn) {
    return (
      <div style={modalStyle} onClick={onClose}>
        <div style={authModalStyle} onClick={(e) => e.stopPropagation()}>
          <button style={modalCloseStyle} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          
          <Login 
            onLogin={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
            userType={userType}
            setUserType={setUserType}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={authModalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={modalCloseStyle} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        {authMode === 'login' ? (
          <Login 
            onLogin={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
            userType={userType}
            setUserType={setUserType}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          <Register 
            onRegister={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
            userType={userType}
            setUserType={setUserType}
          />
        )}
      </div>
    </div>
  );
};

export default Authorisation;
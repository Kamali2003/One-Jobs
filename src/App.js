// src/App.js
import React, { useState } from 'react';
import { JobProvider } from './components/JobContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Employer from './components/Employer';
import JobSeeker from './components/JobSeeker';
import JobSeekerProfile from './components/JobSeekerProfile';
import Authorisation from './components/Authorisation';
import FAQ from './components/FAQ';
import './App.css';

// OTP API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const sendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const loginUser = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState('jobseeker');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUserType, setAuthUserType] = useState('jobseeker');
  const [profileComplete, setProfileComplete] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, loading: true });

  // Check backend connection on app start
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setApiStatus({ connected: true, loading: false });
        console.log('✅ Backend server is connected');
      } else {
        setApiStatus({ connected: false, loading: false });
        console.error('❌ Backend server is not responding');
      }
    } catch (error) {
      setApiStatus({ connected: false, loading: false });
      console.error('❌ Cannot connect to backend server:', error);
    }
  };

  const handleLoginSuccess = async (userType, userData, authData) => {
    try {
      setUserType(userType);
      setIsLoggedIn(true);
      setCurrentUser(userData);
      setShowAuthModal(false);

      // Store auth data in localStorage
      if (authData?.token) {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      if (userType === 'jobseeker') {
        if (userData?.profileComplete) {
          setProfileComplete(true);
          setActiveTab('jobseeker-dashboard');
        } else {
          setActiveTab('jobseeker-profile-setup');
        }
      } else {
        setActiveTab('employer-dashboard');
      }
    } catch (error) {
      console.error('Login success error:', error);
    }
  };

  const handleProfileComplete = (profileData) => {
    setProfileComplete(true);
    setCurrentUser(prev => ({ 
      ...prev, 
      ...profileData, 
      profileComplete: true 
    }));
    
    // Update localStorage
    const updatedUser = { ...currentUser, ...profileData, profileComplete: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setActiveTab('jobseeker-dashboard');
  };

  const handleLoginClick = (type) => {
    setAuthUserType(type);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setProfileComplete(false);
    setActiveTab('home');
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Check for existing login on app load
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setUserType(user.type || 'jobseeker');
        setProfileComplete(user.profileComplete || false);
        
        if (user.type === 'jobseeker') {
          setActiveTab(user.profileComplete ? 'jobseeker-dashboard' : 'jobseeker-profile-setup');
        } else {
          setActiveTab('employer-dashboard');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home handleLoginClick={handleLoginClick} />;
      case 'employer-dashboard':
        return (
          <Employer
            isLoggedIn={isLoggedIn}
            userType={userType}
            userData={currentUser || {}}
          />
        );
      case 'jobseeker-dashboard':
        return (
          <JobSeeker
            isLoggedIn={isLoggedIn}
            userData={currentUser || {}}
          />
        );
      case 'jobseeker-profile-setup':
        return (
          <JobSeekerProfile
            onProfileComplete={handleProfileComplete}
            userData={currentUser || {}}
          />
        );
      case 'faq':
        return <FAQ />;
      default:
        return <Home handleLoginClick={handleLoginClick} />;
    }
  };

  return (
    <JobProvider>
      <div className="App">
        {/* Backend Connection Status Indicator */}
        {!apiStatus.loading && !apiStatus.connected && (
          <div className="connection-warning">
            ⚠️ Backend server is not connected. Some features may not work.
            <button onClick={checkBackendConnection} className="retry-btn">
              Retry Connection
            </button>
          </div>
        )}
        
        <Navbar 
          isLoggedIn={isLoggedIn}
          userType={userType}
          handleLoginClick={handleLoginClick}
          handleLogout={handleLogout}
          currentUser={currentUser}
          profileComplete={profileComplete}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          backendConnected={apiStatus.connected}
        />
        
        <div className="main-content">
          {renderContent()}
        </div>
        
        {showAuthModal && (
          <Authorisation 
            onClose={handleCloseAuthModal}
            onLoginSuccess={handleLoginSuccess}
            initialUserType={authUserType}
            sendOTP={sendOTP}
            verifyOTP={verifyOTP}
            registerUser={registerUser}
            loginUser={loginUser}
            backendConnected={apiStatus.connected}
          />
        )}
        
        {/* Only show FAQ in the footer when not on the FAQ page */}
        {activeTab !== 'faq' && (
          <div>
            <FAQ />
          </div>
        )}
      </div>
    </JobProvider>
  );
}

export default App;

// Export API functions for use in other components
export { sendOTP, verifyOTP, registerUser, loginUser, API_BASE_URL };
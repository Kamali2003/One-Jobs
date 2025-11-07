import React, { useState, useEffect } from "react";

const Navbar = ({
  isLoggedIn,
  userType,
  handleLoginClick,
  handleLogout,
  currentUser,
  profileComplete,
  setActiveTab,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation trigger on component mount
    setIsVisible(true);
  }, []);

  return (
    <nav className="navbar" style={{
      backgroundColor: '#1e40af',
      padding: '0 20px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        opacity: '0.3'
      }}></div>
      
      <div className="nav-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: '2'
      }}>

        {/* Logo Section */}
        <div
          className="nav-brand"
          onClick={() => setActiveTab("home")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ 
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}
        >
          <div className="logo" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            color: 'white',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.1',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            <div className="logo-text" style={{
              display: 'flex',
              alignItems: 'baseline',
              fontWeight: 'bold',
              position: 'relative'
            }}>
              <span className="logo-main" style={{
                fontSize: '32px',
                fontWeight: '900',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'glow 3s ease-in-out infinite alternate'
              }}>ONE JOBS</span>
              
              
              {/* Animated pulse dot */}
              <span style={{
                position: 'absolute',
                right: '-8px',
                top: '8px',
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></span>
            </div>
            <div className="logo-tagline" style={{
              fontSize: '16px',
              fontWeight: '500',
              marginTop: '6px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#dbeafe',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              position: 'relative',
              paddingLeft: '8px',
              transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
              transition: 'all 0.4s ease',
              opacity: isHovered ? 1 : 0.8
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '20px',
                backgroundColor: '#10b981',
                borderRadius: '2px',
                animation: 'slideUpDown 2s ease-in-out infinite'
              }}></span>
              LAST STEP TO FLY
            </div>
          </div>
        </div>

        {/* User Actions Section */}
        <div className="nav-actions" style={{
          transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.6s ease-out 0.2s'
        }}>
          {isLoggedIn ? (
            <div className="user-profile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div className="user-info" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div className="user-avatar" style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 0 20px rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <span className="user-name" style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'white'
                }}>
                  {currentUser?.name ||
                    (userType === "employer" ? "Employer" : "Job Seeker")}
                </span>
                {userType === "jobseeker" && !profileComplete && (
                  <span className="profile-status" style={{
                    fontSize: '0.7rem',
                    color: '#fef3c7',
                    backgroundColor: 'rgba(254, 243, 199, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    border: '1px solid rgba(254, 243, 199, 0.3)',
                    animation: 'pulse 2s infinite'
                  }}>Profile Incomplete</span>
                )}
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Logout"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <div className="auth-buttons" style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <button
                type="button"
                className="btn-signin"
                onClick={() => handleLoginClick("jobseeker")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#1e40af',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.4s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                <i className="fas fa-user" style={{
                  transition: 'transform 0.3s ease'
                }}></i>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn-employer"
                onClick={() => handleLoginClick("employer")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.4s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#d97706';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f59e0b';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                <i className="fas fa-building"></i>
                <span>Employer Login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-50px, -50px) rotate(360deg); }
          }
          
          @keyframes glow {
            0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
            100% { filter: drop-shadow(0 0 15px rgba(255,255,255,0.6)); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
          }
          
          @keyframes slideUpDown {
            0%, 100% { transform: translateY(-50%) scaleY(1); }
            50% { transform: translateY(-50%) scaleY(0.5); }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;

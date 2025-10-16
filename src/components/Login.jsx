import React, { useState } from "react";

const Login = ({ onLogin, onSwitchToRegister, userType, setUserType, onLogout, isLoggedIn }) => {
  const [loginData, setLoginData] = useState({ email: "", phone: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');

  const API_BASE_URL = "http://localhost:5000";

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[+]?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setErrors({});
    
    const newErrors = {};
    if (loginMethod === 'email') {
      if (!loginData.email) newErrors.email = "Email is required";
      else if (!validateEmail(loginData.email)) newErrors.email = "Email is invalid";
    } else {
      if (!loginData.phone) newErrors.phone = "Phone number is required";
      else if (!validatePhone(loginData.phone)) newErrors.phone = "Phone number is invalid";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const identifier = loginMethod === 'email' ? { email: loginData.email } : { phone: loginData.phone };
      const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identifier),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setOtpSent(true);
      alert(`OTP sent to your ${loginMethod}`);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) return await sendOtp();

    setIsLoading(true);
    try {
      const identifier = loginMethod === 'email' ? { email: loginData.email } : { phone: loginData.phone };
      
      // Verify OTP
      const verifyResponse = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...identifier, otp: loginData.otp }),
      });
      
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'OTP verification failed');
      
      // Login
      const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identifier),
      });
      
      const loginDataResponse = await loginResponse.json();
      if (!loginResponse.ok) {
        if (loginResponse.status === 404) {
          throw new Error("Account not found. Please register first.");
        }
        throw new Error(loginDataResponse.error || 'Login failed');
      }
      
      localStorage.setItem('authToken', loginDataResponse.token);
      localStorage.setItem('user', JSON.stringify(loginDataResponse.user));
      onLogin(loginDataResponse.user);
    } catch (error) {
      setErrors({ general: error.message });
      if (error.message.includes("register")) {
        setOtpSent(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
  const containerStyle = { padding: '2rem' };
  const headerStyle = { textAlign: 'center', marginBottom: '1.5rem' };
  const titleStyle = { color: '#2c3e50', margin: '0 0 0.5rem 0', fontSize: '1.8rem' };
  const subtitleStyle = { color: '#7f8c8d', margin: 0, fontSize: '0.95rem' };
  
  const selectorStyle = { 
    display: 'flex', 
    marginBottom: '1.5rem', 
    borderRadius: '8px', 
    overflow: 'hidden', 
    border: '1px solid #e0e0e0' 
  };
  
  const selectorButtonStyle = { 
    flex: 1, 
    padding: '12px', 
    border: 'none', 
    backgroundColor: '#f8f9fa', 
    color: '#6c757d', 
    fontWeight: 500, 
    cursor: 'pointer', 
    transition: 'all 0.3s ease' 
  };
  
  const activeSelectorStyle = { 
    ...selectorButtonStyle, 
    backgroundColor: '#3498db', 
    color: 'white' 
  };
  
  const methodSelectorStyle = { 
    display: 'flex', 
    marginBottom: '1.5rem', 
    borderRadius: '8px', 
    overflow: 'hidden', 
    border: '1px solid #e0e0e0' 
  };
  
  const methodButtonStyle = { 
    flex: 1, 
    padding: '10px', 
    border: 'none', 
    backgroundColor: '#f8f9fa', 
    color: '#6c757d', 
    fontWeight: 500, 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px' 
  };
  
  const activeMethodStyle = { 
    ...methodButtonStyle, 
    backgroundColor: '#e3f2fd', 
    color: '#1976d2' 
  };
  
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
  const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
  const labelStyle = { fontWeight: 500, color: '#2c3e50', fontSize: '0.9rem' };
  
  const inputStyle = { 
    padding: '12px 15px', 
    border: '1px solid #ddd', 
    borderRadius: '6px', 
    fontSize: '1rem', 
    transition: 'border-color 0.3s' 
  };
  
  const inputErrorStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorStyle = { color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' };
  const generalErrorStyle = { 
    backgroundColor: '#fee', 
    padding: '10px', 
    borderRadius: '6px', 
    borderLeft: '4px solid #e74c3c',
    color: '#e74c3c'
  };
  
  const buttonStyle = { 
    padding: '12px 20px', 
    border: 'none', 
    borderRadius: '6px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px' 
  };
  
  const primaryButtonStyle = { 
    ...buttonStyle, 
    backgroundColor: '#3498db', 
    color: 'white' 
  };
  
  const disabledButtonStyle = { 
    ...primaryButtonStyle, 
    backgroundColor: '#bdc3c7', 
    cursor: 'not-allowed' 
  };
  
  const switchStyle = { 
    textAlign: 'center', 
    marginTop: '1rem', 
    paddingTop: '1rem', 
    borderTop: '1px solid #eee' 
  };
  
  const switchTextStyle = { color: '#7f8c8d', margin: 0 };
  const switchLinkStyle = { color: '#3498db', cursor: 'pointer', fontWeight: 600 };
  
  const otpMessageStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    backgroundColor: '#e8f5e9', 
    padding: '12px', 
    borderRadius: '6px', 
    color: '#2e7d32', 
    marginBottom: '1rem' 
  };

  // Logged in UI
  if (isLoggedIn) {
    const logoutSectionStyle = { textAlign: 'center' };
    const userInfoStyle = { marginBottom: '1.5rem' };
    const userIconStyle = { fontSize: '3rem', color: '#3498db', marginBottom: '1rem' };
    const logoutButtonStyle = { 
      ...buttonStyle, 
      backgroundColor: '#e74c3c', 
      color: 'white', 
      width: '100%', 
      marginTop: '1rem' 
    };

    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Welcome Back!</h2>
          <p style={subtitleStyle}>You are logged in as a {userType}</p>
        </div>
        
        <div style={logoutSectionStyle}>
          <div style={userInfoStyle}>
            <i className="fas fa-user-circle" style={userIconStyle}></i>
            <p>You're successfully logged in</p>
          </div>
          
          <button onClick={onLogout} style={logoutButtonStyle}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Login to Your Account</h2>
        <p style={subtitleStyle}>Access your {userType} dashboard</p>
      </div>

      <div style={selectorStyle}>
        <button
          style={userType === "jobseeker" ? activeSelectorStyle : selectorButtonStyle}
          onClick={() => setUserType("jobseeker")}
        >
          Job Seeker
        </button>
        <button
          style={userType === "employer" ? activeSelectorStyle : selectorButtonStyle}
          onClick={() => setUserType("employer")}
        >
          Employer
        </button>
      </div>

      <div style={methodSelectorStyle}>
        <button 
          style={loginMethod === 'email' ? activeMethodStyle : methodButtonStyle}
          onClick={() => setLoginMethod('email')}
        >
          <i className="fas fa-envelope"></i> Email
        </button>
        <button 
          style={loginMethod === 'phone' ? activeMethodStyle : methodButtonStyle}
          onClick={() => setLoginMethod('phone')}
        >
          <i className="fas fa-phone"></i> Phone
        </button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {!otpSent ? (
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'} *
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              name={loginMethod === 'email' ? 'email' : 'phone'}
              value={loginMethod === 'email' ? loginData.email : loginData.phone}
              onChange={handleChange}
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              required
              style={(errors.email || errors.phone) ? inputErrorStyle : inputStyle}
            />
            {(errors.email || errors.phone) && (
              <span style={errorStyle}>{errors.email || errors.phone}</span>
            )}
          </div>
        ) : (
          <>
            <div style={otpMessageStyle}>
              <i className="fas fa-check-circle"></i>
              <p>OTP sent to your {loginMethod}</p>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Enter OTP *</label>
              <input
                type="text"
                name="otp"
                value={loginData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                style={errors.otp ? inputErrorStyle : inputStyle}
                maxLength="6"
                required
              />
              {errors.otp && <span style={errorStyle}>{errors.otp}</span>}
            </div>
          </>
        )}

        {errors.general && (
          <div style={generalErrorStyle}>
            {errors.general}
          </div>
        )}

        <button 
          type="submit" 
          style={isLoading ? disabledButtonStyle : primaryButtonStyle}
          disabled={isLoading}
        >
          {isLoading 
            ? (otpSent ? 'Logging in...' : 'Sending OTP...')
            : (otpSent ? 'Login' : 'Send OTP')
          }
        </button>

        <div style={switchStyle}>
          <p style={switchTextStyle}>
            Don't have an account?{" "}
            <span style={switchLinkStyle} onClick={onSwitchToRegister}>
              Register now
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
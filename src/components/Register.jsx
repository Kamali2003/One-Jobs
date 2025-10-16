import React, { useState } from 'react';

const Register = ({ onRegister, onSwitchToLogin, userType, setUserType }) => {
  const [registerData, setRegisterData] = useState({
    name: '', email: '', phone: '', company: '', otp: ''
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[+]?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''));

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setErrors({});
    
    const newErrors = {};
    if (!registerData.email && !registerData.phone) {
      newErrors.general = "Email or phone is required";
    }
    if (registerData.email && !validateEmail(registerData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (registerData.phone && !validatePhone(registerData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    if (userType === 'employer' && !registerData.company) {
      newErrors.company = "Company name is required";
    }
    if (userType === 'jobseeker' && !registerData.name) {
      newErrors.name = "Full name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const identifier = registerData.email ? { email: registerData.email } : { phone: registerData.phone };
      const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identifier),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setOtpSent(true);
      alert(`OTP sent to your ${registerData.email ? 'email' : 'phone'}`);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!otpSent) return await sendOtp();

    try {
      const identifier = registerData.email ? { email: registerData.email } : { phone: registerData.phone };

      const verifyResponse = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...identifier, otp: registerData.otp }),
      });
      
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'OTP verification failed');

      const registerPayload = {
        name: userType === 'employer' ? registerData.company : registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        company: userType === 'employer' ? registerData.company : '',
        userType: userType
      };
      
      const registerResponse = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload),
      });
      
      const registerDataResponse = await registerResponse.json();
      if (!registerResponse.ok) throw new Error(registerDataResponse.error || 'Registration failed');
      
      localStorage.setItem('authToken', registerDataResponse.token);
      localStorage.setItem('user', JSON.stringify(registerDataResponse.user));
      onRegister(registerDataResponse.user);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

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
  const disabledInputStyle = { ...inputStyle, backgroundColor: '#f5f5f5', color: '#999' };
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Create Your Account</h2>
        <p style={subtitleStyle}>Join as {userType} to get started</p>
      </div>

      <div style={selectorStyle}>
        <button
          style={userType === 'jobseeker' ? activeSelectorStyle : selectorButtonStyle}
          onClick={() => setUserType('jobseeker')}
        >
          Job Seeker
        </button>
        <button
          style={userType === 'employer' ? activeSelectorStyle : selectorButtonStyle}
          onClick={() => setUserType('employer')}
        >
          Employer
        </button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            {userType === 'employer' ? 'Company Name' : 'Full Name'} *
          </label>
          <input
            type="text"
            name={userType === 'employer' ? 'company' : 'name'}
            value={userType === 'employer' ? registerData.company : registerData.name}
            onChange={handleChange}
            placeholder={userType === 'employer' ? 'Enter company name' : 'Enter your full name'}
            required
            style={(errors.company || errors.name) ? inputErrorStyle : (otpSent ? disabledInputStyle : inputStyle)}
            disabled={otpSent}
          />
          {errors.company && <span style={errorStyle}>{errors.company}</span>}
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={errors.email ? inputErrorStyle : (otpSent ? disabledInputStyle : inputStyle)}
            disabled={otpSent}
          />
          {errors.email && <span style={errorStyle}>{errors.email}</span>}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={registerData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            style={errors.phone ? inputErrorStyle : (otpSent ? disabledInputStyle : inputStyle)}
            disabled={otpSent}
          />
          {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
        </div>

        {otpSent && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>OTP *</label>
            <input
              type="text"
              name="otp"
              value={registerData.otp}
              onChange={handleChange}
              placeholder="Enter OTP sent to your email/phone"
              required
              style={errors.otp ? inputErrorStyle : inputStyle}
              maxLength="6"
            />
            {errors.otp && <span style={errorStyle}>{errors.otp}</span>}
          </div>
        )}

        {errors.general && (
          <div style={generalErrorStyle}>{errors.general}</div>
        )}

        <button
          type="submit"
          style={isLoading ? disabledButtonStyle : primaryButtonStyle}
          disabled={isLoading}
        >
          {isLoading 
            ? (otpSent ? 'Creating Account...' : 'Sending OTP...') 
            : (otpSent ? 'Create Account' : 'Send OTP')
          }
        </button>

        <div style={switchStyle}>
          <p style={switchTextStyle}>
            Already have an account?{" "}
            <span style={switchLinkStyle} onClick={onSwitchToLogin}>
              Login now
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
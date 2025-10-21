import React, { useState, useEffect } from 'react';

const JobSeekerProfile = ({ onProfileComplete, userData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: userData?.email || '',
    phone: '',
    location: '',
    resume: null,
    qualifications: '',
    skills: [],
    experienceLevel: '',
    currentStatus: '',
    preferredJobTypes: [],
    preferredLocations: [],
    preferredWorkMode: '',
    expectedSalary: '',
    noticePeriod: ''
  });

  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }
    
    if (step === 2) {
      if (!formData.resume) newErrors.resume = 'Resume is required';
      if (!formData.qualifications) newErrors.qualifications = 'Qualification is required';
      if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
      if (!formData.currentStatus) newErrors.currentStatus = 'Current status is required';
    }
    
    if (step === 3) {
      if (formData.preferredJobTypes.length === 0) newErrors.preferredJobTypes = 'Select at least one job type';
      if (!formData.preferredWorkMode) newErrors.preferredWorkMode = 'Work mode preference is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');

      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: '' }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onProfileComplete(formData);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          fullName: '',
          email: userData?.email || '',
          phone: '',
          location: '',
          resume: null,
          qualifications: '',
          skills: [],
          experienceLevel: '',
          currentStatus: '',
          preferredJobTypes: [],
          preferredLocations: [],
          preferredWorkMode: '',
          expectedSalary: '',
          noticePeriod: ''
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const progressPercentage = (currentStep / 3) * 100;

  // Enhanced CSS styles with animations and gradients
  const styles = {
    container: {
      maxWidth: '900px',
      margin: '40px auto',
      padding: '40px',
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      borderRadius: '28px',
      boxShadow: `
        0 25px 50px rgba(0, 0, 0, 0.25),
        0 15px 35px rgba(102, 126, 234, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(20px)',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      animation: 'slideInUp 0.8s ease-out',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundEffect: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      animation: 'rotate 20s linear infinite',
      pointerEvents: 'none'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      position: 'relative',
      zIndex: 2
    },
    title: {
      margin: '0 0 12px 0',
      color: 'white',
      fontSize: '36px',
      fontWeight: '800',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      margin: '0',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '18px',
      fontWeight: '500',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    },
    progressContainer: {
      margin: '32px 0',
      height: '8px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    progressBar: {
      height: '100%',
      width: `${progressPercentage}%`,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.5)'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0 auto',
      maxWidth: '600px',
      position: 'relative',
      zIndex: 2
    },
    step: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1
    },
    stepNumber: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '18px',
      marginBottom: '12px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s ease',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    activeStep: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.6)'
    },
    stepLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    formContainer: {
      margin: 0,
      position: 'relative',
      zIndex: 2
    },
    stepTitle: {
      margin: '0 0 28px 0',
      color: 'white',
      fontSize: '24px',
      fontWeight: '700',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    formGroup: {
      animation: 'fadeInUp 0.6s ease-out'
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontWeight: '700',
      color: 'white',
      fontSize: '15px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      fontSize: '16px',
      boxSizing: 'border-box',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(15px)',
      color: 'white',
      fontWeight: '500',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    inputError: {
      border: '2px solid #ff6b6b',
      boxShadow: '0 0 0 4px rgba(255, 107, 107, 0.2)',
      background: 'rgba(255, 255, 255, 0.2)'
    },
    inputFocus: {
      borderColor: 'rgba(255, 255, 255, 0.8)',
      boxShadow: `
        0 0 0 4px rgba(255, 255, 255, 0.2),
        inset 0 2px 10px rgba(0, 0, 0, 0.1)
      `,
      outline: 'none',
      transform: 'scale(1.02)',
      background: 'rgba(255, 255, 255, 0.25)'
    },
    select: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      fontSize: '16px',
      boxSizing: 'border-box',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(15px)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      appearance: 'none',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 20px center',
      backgroundSize: '20px',
      color: 'white',
      fontWeight: '500',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    errorText: {
      color: '#ff6b6b',
      fontSize: '14px',
      marginTop: '8px',
      display: 'block',
      fontWeight: '600',
      animation: 'shake 0.6s ease-in-out',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    skillContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '12px'
    },
    skillInput: {
      flex: '1',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      fontSize: '16px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(15px)',
      color: 'white',
      fontWeight: '500',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s ease'
    },
    addSkillButton: {
      padding: '16px 24px',
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      fontWeight: '700',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    skillTag: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)",
      color: 'white',
      padding: '12px 20px',
      borderRadius: '25px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      animation: 'bounceIn 0.5s ease-out',
      transition: 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    removeSkillButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '20px',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      justifyContent: 'center'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px'
    },
    button: {
      padding: '16px 32px',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '16px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    backButton: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
      color: 'white'
    },
    nextButton: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      color: 'white',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)'
    },
    submitButton: {
      background: hoveredButton ? 
        "linear-gradient(135deg, #10b981 0%, #059669 100%)" : 
        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      color: 'white',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)'
    },
    buttonHover: {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(59, 130, 246, 0.7)'
    },
    loadingSpinner: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      animation: 'spin 1s linear infinite'
    },
    successMessage: {
      padding: '20px',
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: 'white',
      borderRadius: '16px',
      marginBottom: '28px',
      textAlign: 'center',
      fontWeight: '700',
      animation: 'bounceIn 0.8s ease-out, pulse 2s infinite',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)'
    }
  };

  // Add CSS animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3) rotate(-180deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.1) rotate(0deg);
        }
        70% {
          transform: scale(0.95) rotate(5deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
        }
        50% {
          transform: scale(1.05);
          boxShadow: 0 15px 40px rgba(16, 185, 129, 0.8);
        }
        100% {
          transform: scale(1);
          boxShadow: 0 10px 30px rgba(16, 185, 129, 0.5);
        }
      }
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      input::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }
      
      select option {
        background: #667eea;
        color: white;
        padding: 12px;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Animated Background Effect */}
      <div style={styles.backgroundEffect}></div>
      
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Complete Your Profile</h1>
        <p style={styles.subtitle}>
          Set up your professional profile to start finding your dream job
        </p>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}></div>
        </div>

        {/* Step Indicators */}
        <div style={styles.stepIndicator}>
          {['Personal Info', 'Professional Info', 'Job Preferences'].map((label, index) => (
            <div key={index} style={styles.step}>
              <div style={{
                ...styles.stepNumber,
                ...(currentStep >= index + 1 ? styles.activeStep : {})
              }}>
                {index + 1}
              </div>
              <span style={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        {submitSuccess && (
          <div style={styles.successMessage}>
            🎉 Profile completed successfully! Redirecting...
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <h2 style={styles.stepTitle}>👤 Personal Information</h2>
            <div style={styles.grid}>
              {[
                { id: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Enter your full name...' },
                { id: 'email', label: 'Email Address *', type: 'email', placeholder: 'Enter your email...' },
                { id: 'phone', label: 'Phone Number *', type: 'tel', placeholder: 'Enter your phone number...' },
                { id: 'location', label: 'Location *', type: 'text', placeholder: 'Enter your location...' }
              ].map((field, index) => (
                <div key={field.id} style={{ ...styles.formGroup, animationDelay: `${index * 0.1}s` }}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    style={{
                      ...styles.input,
                      ...(errors[field.id] ? styles.inputError : {})
                    }}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    required
                  />
                  {errors[field.id] && <span style={styles.errorText}>{errors[field.id]}</span>}
                </div>
              ))}
            </div>
            <div style={styles.buttonGroup}>
              <div></div> {/* Spacer */}
              <button
                type="button"
                onClick={nextStep}
                style={styles.nextButton}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.nextButton)}
              >
                Next: Professional Information →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Information */}
        {currentStep === 2 && (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <h2 style={styles.stepTitle}>💼 Professional Information</h2>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>📄 Upload Resume (PDF) *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    ...styles.input,
                    ...(errors.resume ? styles.inputError : {})
                  }}
                  required
                />
                {errors.resume && <span style={styles.errorText}>{errors.resume}</span>}
                {formData.resume && (
                  <p style={{ color: '#10b981', fontSize: '14px', margin: '12px 0 0 0', fontWeight: '600' }}>
                    ✅ {formData.resume.name}
                  </p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>🎓 Highest Qualification *</label>
                <select
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.qualifications ? styles.inputError : {})
                  }}
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="High School">High School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
                {errors.qualifications && <span style={styles.errorText}>{errors.qualifications}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📈 Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.experienceLevel ? styles.inputError : {})
                  }}
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="Fresher (0-2 years)">🎓 Fresher (0-2 years)</option>
                  <option value="Junior (2-4 years)">🚀 Junior (2-4 years)</option>
                  <option value="Mid-Level (4-6 years)">💪 Mid-Level (4-6 years)</option>
                  <option value="Senior (6+ years)">🏆 Senior (6+ years)</option>
                </select>
                {errors.experienceLevel && <span style={styles.errorText}>{errors.experienceLevel}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📊 Current Status *</label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.currentStatus ? styles.inputError : {})
                  }}
                  required
                >
                  <option value="">Select current status</option>
                  <option value="Student">🎓 Student</option>
                  <option value="Employed">💼 Employed</option>
                  <option value="Unemployed">🔍 Unemployed</option>
                  <option value="Freelancer">🚀 Freelancer</option>
                </select>
                {errors.currentStatus && <span style={styles.errorText}>{errors.currentStatus}</span>}
              </div>

              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>🛠️ Skills *</label>
                <div style={styles.skillContainer}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    style={styles.skillInput}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.skillInput)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    style={styles.addSkillButton}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, styles.addSkillButton)}
                  >
                    ➕ Add
                  </button>
                </div>
                {errors.skills && <span style={styles.errorText}>{errors.skills}</span>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={styles.skillTag}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 100%)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        style={styles.removeSkillButton}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                          e.target.style.transform = 'scale(1.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'none';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={prevStep}
                style={styles.backButton}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.backButton)}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                style={styles.nextButton}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.nextButton)}
              >
                Next: Job Preferences →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Job Preferences */}
        {currentStep === 3 && (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <h2 style={styles.stepTitle}>🎯 Job Preferences</h2>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>💼 Preferred Job Types *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: '500' }}>
                      <input
                        type="checkbox"
                        checked={formData.preferredJobTypes.includes(type)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.preferredJobTypes, type]
                            : formData.preferredJobTypes.filter(t => t !== type);
                          handleArrayChange('preferredJobTypes', updated);

                          if (errors.preferredJobTypes) {
                            setErrors(prev => ({ ...prev, preferredJobTypes: '' }));
                          }
                        }}
                        style={{ 
                          width: '20px', 
                          height: '20px',
                          accentColor: '#10b981'
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredJobTypes && <span style={styles.errorText}>{errors.preferredJobTypes}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>🏠 Preferred Work Mode *</label>
                <select
                  name="preferredWorkMode"
                  value={formData.preferredWorkMode}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.preferredWorkMode ? styles.inputError : {})
                  }}
                  required
                >
                  <option value="">Select work mode</option>
                  <option value="Remote">🌍 Remote</option>
                  <option value="Hybrid">🔀 Hybrid</option>
                  <option value="On-site">🏢 On-site</option>
                </select>
                {errors.preferredWorkMode && <span style={styles.errorText}>{errors.preferredWorkMode}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📍 Preferred Locations</label>
                <input
                  type="text"
                  value={formData.preferredLocations.join(', ')}
                  onChange={(e) => handleArrayChange('preferredLocations', e.target.value.split(',').map(v => v.trim()))}
                  placeholder="Enter preferred cities (comma separated)..."
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>💰 Expected Salary</label>
                <select
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="">Select expected salary</option>
                  <option value="0-3 LPA">0-3 LPA</option>
                  <option value="3-6 LPA">3-6 LPA</option>
                  <option value="6-10 LPA">6-10 LPA</option>
                  <option value="10-15 LPA">10-15 LPA</option>
                  <option value="15-20 LPA">15-20 LPA</option>
                  <option value="20+ LPA">20+ LPA</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>⏰ Notice Period</label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="">Select notice period</option>
                  <option value="Immediate">⚡ Immediate</option>
                  <option value="15 days">📅 15 days</option>
                  <option value="1 month">📅 1 month</option>
                  <option value="2 months">📅 2 months</option>
                  <option value="3 months">📅 3 months</option>
                </select>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={prevStep}
                style={styles.backButton}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.backButton)}
              >
                ← Back
              </button>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...styles.submitButton
                }}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Completing Profile...
                  </>
                ) : (
                  '🚀 Complete Profile'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobSeekerProfile;

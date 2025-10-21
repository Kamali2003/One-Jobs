import React, { useState, useEffect } from 'react';

const JobForm = ({ onJobPost }) => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    workMode: 'Remote',
    experience: 'Entry-level',
    location: '',
    qualification: '',
    description: '',
    salary: '',
    salaryType: 'range', 
    salaryMin: '',
    salaryMax: '',
    skills: []
  });

  const [errors, setErrors] = useState({});
  const [currentSkill, setCurrentSkill] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSkillAdd = () => {
    if (currentSkill.trim() && !jobData.skills.includes(currentSkill.trim())) {
      setJobData({
        ...jobData,
        skills: [...jobData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setJobData({
      ...jobData,
      skills: jobData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!jobData.title.trim()) newErrors.title = 'Job title is required';
    if (!jobData.company.trim()) newErrors.company = 'Company name is required';
    if (!jobData.location.trim()) newErrors.location = 'Location is required';
    if (!jobData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!jobData.description.trim()) newErrors.description = 'Description is required';
    if (jobData.description.length < 50) newErrors.description = 'Description should be at least 50 characters';

    if (jobData.salaryType === 'range') {
      if (jobData.salaryMin && jobData.salaryMax) {
        if (parseInt(jobData.salaryMin) > parseInt(jobData.salaryMax)) {
          newErrors.salary = 'Minimum salary cannot be greater than maximum salary';
        }
      } else if (jobData.salaryMin || jobData.salaryMax) {
        newErrors.salary = 'Both min and max salary are required for range';
      }
    } else if (jobData.salaryType === 'fixed' && jobData.salary) {
      if (isNaN(jobData.salary)) {
        newErrors.salary = 'Salary must be a number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatSalaryForStorage = () => {
    if (jobData.salaryType === 'range' && jobData.salaryMin && jobData.salaryMax) {
      return { min: parseInt(jobData.salaryMin), max: parseInt(jobData.salaryMax) };
    } else if (jobData.salaryType === 'fixed' && jobData.salary) {
      return parseInt(jobData.salary);
    } else if (jobData.salary) {
      return jobData.salary;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newJob = {
      ...jobData,
      title: jobData.title.trim(),
      company: jobData.company.trim(),
      location: jobData.location.trim(),
      qualification: jobData.qualification.trim(),
      description: jobData.description.trim(),
      salary: formatSalaryForStorage(),
      postedDate: new Date().toISOString(),
      applicants: 0,
      id: Date.now() 
    };

    delete newJob.salaryType;
    delete newJob.salaryMin;
    delete newJob.salaryMax;

    onJobPost(newJob);
    setSuccessMessage('🎉 Job posted successfully!');
    setIsSubmitting(false);

    // Reset form with animation
    setTimeout(() => {
      setJobData({
        title: '',
        company: '',
        workMode: 'Remote',
        experience: 'Entry-level',
        location: '',
        qualification: '',
        description: '',
        salary: '',
        salaryType: 'range',
        salaryMin: '',
        salaryMax: '',
        skills: []
      });
      setErrors({});
      setCurrentSkill('');
    }, 500);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Enhanced CSS styles with animations and gradients
  const styles = {
    container: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: '40px 32px',
      borderRadius: '28px',
      boxShadow: `
        0 25px 50px rgba(0, 0, 0, 0.25),
        0 15px 35px rgba(102, 126, 234, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      marginBottom: '32px',
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
    title: {
      marginBottom: '32px',
      color: 'white',
      fontSize: '32px',
      fontWeight: '800',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2
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
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 2
    },
    formGroup: {
      marginBottom: '26px',
      animation: 'fadeInUp 0.8s ease-out',
      position: 'relative',
      zIndex: 2
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      fontWeight: '700',
      color: 'white',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
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
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 2
    },
    skillTag: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)",
      color: 'white',
      padding: '10px 18px',
      borderRadius: '25px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      animation: 'bounceIn 0.5s ease-out',
      transition: 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
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
    addSkillButtonHover: {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(16, 185, 129, 0.7)'
    },
    submitButton: {
      padding: '20px 40px',
      background: hoveredButton ? 
        "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)" : 
        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      color: 'white',
      border: 'none',
      borderRadius: '18px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      fontWeight: '800',
      fontSize: '18px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 12px 35px rgba(79, 70, 229, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transform: hoveredButton && !isSubmitting ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    loadingSpinner: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      animation: 'spin 1s linear infinite'
    },
    characterCount: {
      fontSize: '14px',
      color: jobData.description.length >= 50 ? '#10b981' : 'rgba(255, 255, 255, 0.8)',
      marginTop: '8px',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.8);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
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
      @keyframes glow {
        0% {
          box-shadow: 0 12px 35px rgba(79, 70, 229, 0.5);
        }
        50% {
          box-shadow: 0 18px 45px rgba(79, 70, 229, 0.8);
        }
        100% {
          boxShadow: 0 12px 35px rgba(79, 70, 229, 0.5);
        }
      }
      
      input::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }
      
      textarea::placeholder {
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

  const formGroups = [
    {
      id: 'title',
      label: '🎯 Job Title *',
      type: 'text',
      placeholder: 'Enter job title...'
    },
    {
      id: 'company',
      label: '🏢 Company Name *',
      type: 'text',
      placeholder: 'Enter company name...'
    },
    {
      id: 'location',
      label: '📍 Location *',
      type: 'text',
      placeholder: 'Enter job location...'
    },
    {
      id: 'qualification',
      label: '🎓 Qualification Required *',
      type: 'text',
      placeholder: 'Enter required qualification...'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background Effect */}
      <div style={styles.backgroundEffect}></div>
      
      <h3 style={styles.title}>🚀 Post a New Job Opportunity</h3>
      
      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginBottom: '26px', 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2
        }}>
          {formGroups.map((group, index) => (
            <div 
              key={group.id}
              style={{
                flex: '1',
                minWidth: '280px',
                animationDelay: `${index * 0.15}s`
              }}
            >
              <label style={styles.label}>
                {group.label}
              </label>
              <input 
                type={group.type}
                name={group.id}
                value={jobData[group.id]}
                onChange={handleChange}
                placeholder={group.placeholder}
                style={{
                  ...styles.input,
                  ...(errors[group.id] ? styles.inputError : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                required 
              />
              {errors[group.id] && (
                <span style={styles.errorText}>
                  {errors[group.id]}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginBottom: '26px', 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={styles.label}>
              💼 Work Mode *
            </label>
            <select 
              name="workMode"
              value={jobData.workMode}
              onChange={handleChange}
              style={styles.select}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.select)}
              required
            >
              <option value="Remote">🌍 Remote</option>
              <option value="Hybrid">🔀 Hybrid</option>
              <option value="On-site">🏢 On-site</option>
            </select>
          </div>
          
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={styles.label}>
              📈 Experience Level *
            </label>
            <select 
              name="experience"
              value={jobData.experience}
              onChange={handleChange}
              style={styles.select}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.select)}
              required
            >
              <option value="Internship">🎓 Internship</option>
              <option value="Entry-level">🚀 Entry-level (0-2 years)</option>
              <option value="Mid-level">💪 Mid-level (2-5 years)</option>
              <option value="Senior">🏆 Senior (5+ years)</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            💰 Salary Type
          </label>
          <select 
            name="salaryType"
            value={jobData.salaryType}
            onChange={handleChange}
            style={styles.select}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.select)}
          >
            <option value="range">📊 Salary Range</option>
            <option value="fixed">💰 Fixed Salary</option>
            <option value="text">📝 Text Description</option>
          </select>
        </div>

        {jobData.salaryType === 'range' && (
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            marginBottom: '26px', 
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <label style={styles.label}>
                Minimum Salary (K)
              </label>
              <input 
                type="number"
                name="salaryMin"
                value={jobData.salaryMin}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                style={{
                  ...styles.input,
                  ...(errors.salary ? styles.inputError : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <label style={styles.label}>
                Maximum Salary (K)
              </label>
              <input 
                type="number"
                name="salaryMax"
                value={jobData.salaryMax}
                onChange={handleChange}
                placeholder="e.g., 70"
                min="0"
                style={{
                  ...styles.input,
                  ...(errors.salary ? styles.inputError : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>
            {errors.salary && (
              <span style={{ ...styles.errorText, width: '100%' }}>
                {errors.salary}
              </span>
            )}
          </div>
        )}

        {jobData.salaryType === 'fixed' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Fixed Salary (K)
            </label>
            <input 
              type="number"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              placeholder="e.g., 60"
              min="0"
              style={{
                ...styles.input,
                ...(errors.salary ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
            {errors.salary && (
              <span style={styles.errorText}>
                {errors.salary}
              </span>
            )}
          </div>
        )}

        {jobData.salaryType === 'text' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Salary Description
            </label>
            <input 
              type="text" 
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              placeholder="e.g., $50K-70K or Negotiable"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        )}
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            🛠️ Required Skills
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '16px',
            position: 'relative',
            zIndex: 2
          }}>
            <input 
              type="text" 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              style={styles.addSkillButton}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.addSkillButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.addSkillButton)}
            >
              ➕ Add Skill
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px',
            position: 'relative',
            zIndex: 2
          }}>
            {jobData.skills.map((skill, index) => (
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
                  onClick={() => handleSkillRemove(skill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    justifyContent: 'center'
                  }}
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
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            📝 Job Description *
          </label>
          <textarea 
            name="description"
            value={jobData.description}
            onChange={handleChange}
            rows="6"
            style={{
              ...styles.input,
              ...(errors.description ? styles.inputError : {}),
              resize: 'vertical',
              fontFamily: 'inherit',
              minHeight: '140px'
            }}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required 
          ></textarea>
          {errors.description && (
            <span style={styles.errorText}>
              {errors.description}
            </span>
          )}
          <div style={styles.characterCount}>
            {jobData.description.length >= 50 ? '✅' : '📝'} 
            {jobData.description.length}/50 characters minimum
            {jobData.description.length >= 50 && ' - Ready to post!'}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={styles.submitButton}
          onMouseEnter={() => !isSubmitting && setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
        >
          {isSubmitting ? (
            <>
              <div style={styles.loadingSpinner}></div>
              Posting Job...
            </>
          ) : (
            '🚀 Post Job Opportunity'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobForm;

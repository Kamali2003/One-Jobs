import React, { useState } from 'react';

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

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }}>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          color: '#111827',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Complete Your Profile
        </h1>
        <p style={{ 
          margin: '0', 
          color: '#6b7280',
          fontSize: '16px'
        }}>
          Set up your professional profile to start finding your dream job
        </p>

        <div style={{ 
          margin: '24px 0',
          height: '6px',
          backgroundColor: '#e5e7eb',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercentage}%`,
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          margin: '0 auto',
          maxWidth: '500px'
        }}>
          {['Personal Info', 'Professional Info', 'Job Preferences'].map((label, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: currentStep >= index + 1 ? '#3b82f6' : '#e5e7eb',
                color: currentStep >= index + 1 ? 'white' : '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {index + 1}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: currentStep >= index + 1 ? '600' : '400',
                color: currentStep >= index + 1 ? '#3b82f6' : '#9ca3af',
                textAlign: 'center'
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ margin: 0 }}>
        {currentStep === 1 && (
          <div>
            <h2 style={{ 
              margin: '0 0 24px 0', 
              color: '#111827',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Personal Information
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.fullName ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {errors.fullName && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.email ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {errors.email && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.phone ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {errors.phone && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.location ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {errors.location && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={nextStep}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Next: Professional Information
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ 
              margin: '0 0 24px 0', 
              color: '#111827',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Professional Information
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Upload Resume (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.resume ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  required
                />
                {errors.resume && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.resume}</span>}
                {formData.resume && (
                  <p style={{ color: '#10b981', fontSize: '14px', margin: '8px 0 0 0' }}>
                    ✓ {formData.resume.name}
                  </p>
                )}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Highest Qualification *
                </label>
                <select
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.qualifications ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
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
                {errors.qualifications && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.qualifications}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.experienceLevel ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="Fresher (0-2 years)">Fresher (0-2 years)</option>
                  <option value="Junior (2-4 years)">Junior (2-4 years)</option>
                  <option value="Mid-Level (4-6 years)">Mid-Level (4-6 years)</option>
                  <option value="Senior (6+ years)">Senior (6+ years)</option>
                </select>
                {errors.experienceLevel && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.experienceLevel}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Current Status *
                </label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.currentStatus ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Select current status</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
                {errors.currentStatus && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.currentStatus}</span>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Skills *
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    style={{
                      flex: '1',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Add
                  </button>
                </div>
                {errors.skills && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.skills}</span>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={prevStep}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Next: Job Preferences
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 style={{ 
              margin: '0 0 24px 0', 
              color: '#111827',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Job Preferences
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Preferred Job Types *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredJobTypes && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.preferredJobTypes}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Preferred Work Mode *
                </label>
                <select
                  name="preferredWorkMode"
                  value={formData.preferredWorkMode}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: errors.preferredWorkMode ? '2px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Select work mode</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
                {errors.preferredWorkMode && <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.preferredWorkMode}</span>}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Preferred Locations
                </label>
                <input
                  type="text"
                  value={formData.preferredLocations.join(', ')}
                  onChange={(e) => handleArrayChange('preferredLocations', e.target.value.split(',').map(v => v.trim()))}
                  placeholder="Enter preferred cities (comma separated)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Expected Salary
                </label>
                <select
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
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
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Notice Period
                </label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select notice period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 days">15 days</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={prevStep}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobSeekerProfile;
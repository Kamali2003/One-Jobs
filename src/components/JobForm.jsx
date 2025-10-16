import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
    setSuccessMessage('Job posted successfully!');

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

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #f0f4ff, #e6f0fa)",
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      marginBottom: '24px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#111827' }}>Post a New Job</h3>
      
      {successMessage && (
        <div style={{
          padding: '12px',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Job Title *
            </label>
            <input 
              type="text" 
              name="title"
              value={jobData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.title ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required 
            />
            {errors.title && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Company Name *
            </label>
            <input 
              type="text" 
              name="company"
              value={jobData.company}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.company ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required 
            />
            {errors.company && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.company}</span>}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Work Mode *
            </label>
            <select 
              name="workMode"
              value={jobData.workMode}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Experience Level *
            </label>
            <select 
              name="experience"
              value={jobData.experience}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="Internship">Internship</option>
              <option value="Entry-level">Entry-level (0-2 years)</option>
              <option value="Mid-level">Mid-level (2-5 years)</option>
              <option value="Senior">Senior (5+ years)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Location *
            </label>
            <input 
              type="text" 
              name="location"
              value={jobData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.location ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required 
            />
            {errors.location && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Salary Type
            </label>
            <select 
              name="salaryType"
              value={jobData.salaryType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option value="range">Salary Range</option>
              <option value="fixed">Fixed Salary</option>
              <option value="text">Text Description</option>
            </select>
          </div>
        </div>

        {jobData.salaryType === 'range' && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
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
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.salary ? '2px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
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
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.salary ? '2px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {errors.salary && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block', width: '100%' }}>{errors.salary}</span>}
          </div>
        )}

        {jobData.salaryType === 'fixed' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
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
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.salary ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {errors.salary && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.salary}</span>}
          </div>
        )}

        {jobData.salaryType === 'text' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
              Salary Description
            </label>
            <input 
              type="text" 
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              placeholder="e.g., $50K-70K or Negotiable"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
            Qualification Required *
          </label>
          <input 
            type="text" 
            name="qualification"
            value={jobData.qualification}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: errors.qualification ? '2px solid #dc2626' : '1px solid #d1d5db',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required 
          />
          {errors.qualification && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.qualification}</span>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
            Required Skills
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text" 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
              style={{
                flex: '1',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {jobData.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '6px 12px',
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
                  onClick={() => handleSkillRemove(skill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '16px',
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
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
            Job Description *
          </label>
          <textarea 
            name="description"
            value={jobData.description}
            onChange={handleChange}
            rows="5"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: errors.description ? '2px solid #dc2626' : '1px solid #d1d5db',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            required 
          ></textarea>
          {errors.description && <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {jobData.description.length}/50 characters minimum
          </div>
        </div>
        
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
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
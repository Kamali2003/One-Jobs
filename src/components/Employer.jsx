import React, { useState, useEffect, useCallback } from "react";

const Employer = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    workMode: "On-site",
    jobType: "Full-time",
    experience: "",
    qualification: "",
    salary: "",
    skills: [],
    description: ""
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    remoteJobs: 0
  });
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced CSS styles
  const styles = {
    container: {
      padding: "30px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      animation: "fadeInDown 0.8s ease-out"
    },
    title: {
      textAlign: "center",
      margin: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "2.5rem",
      fontWeight: "700"
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)"
    },
    debugInfo: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "12px",
      borderRadius: "10px",
      marginBottom: "25px",
      fontSize: "14px",
      color: "#6b7280",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      animation: "slideInLeft 0.6s ease-out"
    },
    statsContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap"
    },
    statCard: {
      flex: "1 1 200px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      color: "white",
      transition: "all 0.3s ease",
      animation: "zoomIn 0.6s ease-out"
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
    },
    form: {
      background: "rgba(255, 255, 255, 0.9)",
      padding: "30px",
      borderRadius: "15px",
      marginBottom: "30px",
      boxShadow: "0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      animation: "slideInUp 0.8s ease-out"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      borderRadius: "8px",
      border: "1px solid #e1e5e9",
      transition: "all 0.3s ease",
      fontSize: "14px",
      background: "rgba(255, 255, 255, 0.8)"
    },
    inputFocus: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      outline: "none",
      transform: "scale(1.02)"
    },
    skillTag: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "6px 15px",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "white",
      fontSize: "14px",
      fontWeight: "500",
      animation: "bounceIn 0.5s ease-out"
    },
    jobCard: {
      padding: "25px",
      border: "1px solid #e1e5e9",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      animation: "fadeInUp 0.6s ease-out",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    },
    jobCardHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      borderColor: "#667eea"
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.3s ease-out"
    },
    modalContent: {
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      maxWidth: "800px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      animation: "scaleIn 0.3s ease-out"
    },
    successMessage: {
      color: "#10b981",
      marginBottom: "15px",
      padding: "12px 15px",
      background: "#ecfdf5",
      borderRadius: "8px",
      border: "1px solid #a7f3d0",
      animation: "slideInRight 0.5s ease-out"
    },
    errorMessage: {
      color: "#ef4444",
      margin: "5px 0 0",
      fontSize: "14px",
      animation: "shake 0.5s ease-in-out"
    }
  };

  // Load applications with useCallback
  const loadApplications = useCallback(() => {
    const savedApplications = localStorage.getItem("jobApplications");
    if (savedApplications) {
      try {
        const parsedApplications = JSON.parse(savedApplications);
        console.log("Loaded applications:", parsedApplications);
        setApplications(parsedApplications);
      } catch (error) {
        console.error("Error parsing applications:", error);
        setApplications([]);
      }
    } else {
      setApplications([]);
    }
  }, []);

  // Load jobs with useCallback
  const loadJobs = useCallback(() => {
    const savedJobs = localStorage.getItem("employerJobs");
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobs(parsedJobs);
        updateStats(parsedJobs);
      } catch (error) {
        console.error("Error parsing jobs:", error);
        setJobs([]);
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadJobs();
    loadApplications();
    
    const timer = setTimeout(() => setIsLoading(false), 1000);

    // Set up interval to check for changes
    const intervalId = setInterval(() => {
      loadApplications();
      loadJobs();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [loadApplications, loadJobs]);

  // Update stats
  const updateStats = (jobsList) => {
    const totalJobs = jobsList.length;
    const totalApplicants = jobsList.reduce(
      (sum, job) => sum + (job.applicants || 0),
      0
    );
    const remoteJobs = jobsList.filter(
      (job) => job.workMode === "Remote"
    ).length;

    setStats({ totalJobs, totalApplicants, remoteJobs });
  };

  useEffect(() => {
    localStorage.setItem("employerJobs", JSON.stringify(jobs));
    updateStats(jobs);
  }, [jobs]);

  // Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.length < 50)
      newErrors.description = "Description should be at least 50 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      workMode: "On-site",
      jobType: "Full-time",
      experience: "",
      qualification: "",
      salary: "",
      skills: [],
      description: ""
    });
    setEditingJobId(null);
    setErrors({});
    setNewSkill("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      if (editingJobId) {
        setJobs(
          jobs.map((job) =>
            job.id === editingJobId
              ? { ...formData, id: editingJobId, datePosted: job.datePosted, applicants: job.applicants || 0 }
              : job
          )
        );
        setSuccessMessage("Job updated successfully!");
      } else {
        setJobs([
          ...jobs,
          { 
            id: Date.now(), 
            ...formData, 
            datePosted: new Date().toLocaleDateString(), 
            applicants: 0 
          }
        ]);
        setSuccessMessage("Job posted successfully!");
      }

      resetForm();
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 800);
  };

  const handleEditJob = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      experience: job.experience,
      qualification: job.qualification,
      salary: job.salary,
      skills: job.skills,
      description: job.description
    });
    setEditingJobId(job.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Applications viewing function
  const viewApplications = (job) => {
    console.log("Viewing applications for job:", job);
    
    // Reload applications to ensure we have the latest data
    loadApplications();
    
    // Set the selected job first to show the modal immediately
    setSelectedJobApplications(job);
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    const updated = applications.map((app) =>
      app.applicationId === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem("jobApplications", JSON.stringify(updated));
  };

  // Application filtering that handles all cases
  const filteredApplications = applications.filter((app) => {
    if (!selectedJobApplications) return false;
    
    const jobIdString = selectedJobApplications.id.toString();
    
    // Multiple matching strategies
    const exactJobIdMatch = app.jobId === jobIdString;
    const numericJobIdMatch = app.jobId && parseInt(app.jobId) === selectedJobApplications.id;
    
    // Fallback matching using job title and company (for applications without jobId)
    const titleCompanyMatch = 
      app.jobTitle === selectedJobApplications.title && 
      app.company === selectedJobApplications.company;
    
    // Search term matching
    const searchMatch = 
      app.applicant.name.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      applicationSearchTerm === "";
    
    // Return true if any job matching strategy succeeds AND search matches
    return (exactJobIdMatch || numericJobIdMatch || titleCompanyMatch) && searchMatch;
  });

  const downloadResume = (app) => {
    if (app.applicant.resume) {
      const link = document.createElement("a");
      link.href = app.applicant.resume.content;
      link.download = app.applicant.resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Application Sent": return "#3b82f6";
      case "Viewed": return "#f59e0b";
      case "Shortlisted": return "#8b5cf6";
      case "Interview Scheduled": return "#ec4899";
      case "Rejected": return "#ef4444";
      case "Accepted": return "#10b981";
      default: return "#6b7280";
    }
  };

  // Refresh data manually
  const refreshData = () => {
    setIsLoading(true);
    loadJobs();
    loadApplications();
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Data refreshed successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }, 1000);
  };

  // Add CSS animations to the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeInDown {
        from { 
          opacity: 0; 
          transform: translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      @keyframes slideInRight {
        from { 
          opacity: 0; 
          transform: translateX(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      @keyframes zoomIn {
        from { 
          opacity: 0; 
          transform: scale(0.9); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      @keyframes scaleIn {
        from { 
          opacity: 0; 
          transform: scale(0.8); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      @keyframes bounceIn {
        0% { 
          opacity: 0; 
          transform: scale(0.3); 
        }
        50% { 
          opacity: 1; 
          transform: scale(1.05); 
        }
        70% { 
          transform: scale(0.9); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .loading-spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)"
        }}>
          <div className="loading-spinner"></div>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>
          Employer Dashboard
        </h1>
        <div>
          <button
            onClick={refreshData}
            style={styles.button}
            onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, styles.button)}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div style={styles.debugInfo}>
        <strong>Debug Info:</strong> {applications.length} total applications, {jobs.length} jobs
        <br />
        <strong>Applications with jobId:</strong> {applications.filter(app => app.jobId).length}
        <br />
        <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        {[
          { label: "Total Jobs", value: stats.totalJobs, color: "#667eea" },
          { label: "Total Applicants", value: stats.totalApplicants, color: "#764ba2" },
          { label: "Remote Jobs", value: stats.remoteJobs, color: "#f093fb" }
        ].map((stat, index) => (
          <div 
            key={index}
            style={styles.statCard}
            onMouseOver={(e) => Object.assign(e.target.style, styles.statCardHover)}
            onMouseOut={(e) => Object.assign(e.target.style, styles.statCard)}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", opacity: 0.9 }}>{stat.label}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: "5px 0" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Job Post Form */}
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <h2 style={{ marginTop: 0, color: "#374151", marginBottom: "25px" }}>
          {editingJobId ? "Edit Job" : "Post a New Job"}
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {['title', 'company', 'location', 'salary', 'experience', 'qualification'].map((field) => (
            <div key={field}>
              <input 
                type="text" 
                name={field} 
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} 
                value={formData[field]} 
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors[field] ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)" } : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
              {errors[field] && <p style={styles.errorMessage}>{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <select 
              name="workMode" 
              value={formData.workMode} 
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <select 
              name="jobType" 
              value={formData.jobType} 
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Skills Required:</label>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <input 
              type="text" 
              placeholder="Add skill" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
            <button 
              type="button" 
              onClick={addSkill}
              style={{
                ...styles.button,
                padding: "12px 20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
              onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" })}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {formData.skills.map((skill, index) => (
              <span key={index} style={styles.skillTag}>
                {skill}
                <button 
                  type="button" 
                  onClick={() => removeSkill(skill)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "white" }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <textarea 
            name="description" 
            placeholder="Job Description (minimum 50 characters)" 
            value={formData.description} 
            onChange={handleChange}
            rows="5"
            style={{
              ...styles.input,
              minHeight: "120px",
              ...(errors.description ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)" } : {})
            }}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
          {errors.description && <p style={styles.errorMessage}>{errors.description}</p>}
          <p style={{ fontSize: "13px", color: formData.description.length >= 50 ? "#10b981" : "#6b7280", margin: "8px 0 0", fontWeight: "500" }}>
            {formData.description.length}/50 characters
            {formData.description.length >= 50 && " ✓"}
          </p>
        </div>

        {successMessage && (
          <div style={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            type="submit"
            style={{
              ...styles.button,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "14px 25px"
            }}
            onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" })}
          >
            {editingJobId ? "Update Job" : "Post Job"}
          </button>
          {editingJobId && (
            <button 
              type="button" 
              onClick={resetForm}
              style={{
                ...styles.button,
                background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
              }}
              onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" })}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Job Listings */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#374151", marginBottom: "20px", animation: "fadeInUp 0.6s ease-out" }}>Your Job Postings</h2>
        
        <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            background: "rgba(255, 255, 255, 0.7)", 
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            animation: "fadeInUp 0.6s ease-out"
          }}>
            <p style={{ fontSize: "18px", color: "#6b7280", margin: 0 }}>
              {jobs.length === 0 ? "You haven't posted any jobs yet." : "No jobs match your search."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                style={styles.jobCard}
                onMouseOver={(e) => Object.assign(e.target.style, styles.jobCardHover)}
                onMouseOut={(e) => Object.assign(e.target.style, styles.jobCard)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#1f2937", fontSize: "20px" }}>{job.title}</h3>
                    <p style={{ margin: "0 0 6px 0", color: "#6b7280", fontSize: "15px" }}>
                      {job.company} • {job.location} • {job.workMode}
                    </p>
                    <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
                      Posted: {job.datePosted} • Applicants: {job.applicants || 0}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button 
                      onClick={() => viewApplications(job)}
                      style={{
                        ...styles.button,
                        background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
                        padding: "8px 16px",
                        fontSize: "13px"
                      }}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)" })}
                    >
                      View Applications ({job.applicants || 0})
                    </button>
                    <button 
                      onClick={() => handleEditJob(job)}
                      style={{
                        ...styles.button,
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        padding: "8px 16px",
                        fontSize: "13px"
                      }}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" })}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      style={{
                        ...styles.button,
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        padding: "8px 16px",
                        fontSize: "13px"
                      }}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                  <strong>Type:</strong> {job.jobType} • <strong>Experience:</strong> {job.experience} • <strong>Salary:</strong> {job.salary}
                </div>
                <div style={{ marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                  <strong>Skills:</strong> {job.skills.join(", ")}
                </div>
                <p style={{ margin: "0", color: "#6b7280", lineHeight: "1.5" }}>
                  {job.description.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications Modal */}
      {selectedJobApplications && (
        <div style={styles.modalOverlay} onClick={() => setSelectedJobApplications(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <h2 style={{ margin: 0, color: "#1f2937" }}>
                Applications for {selectedJobApplications.title}
                <div style={{ fontSize: "15px", color: "#6b7280", marginTop: "8px", fontWeight: "normal" }}>
                  {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
                </div>
              </h2>
              <button 
                onClick={() => setSelectedJobApplications(null)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  fontSize: "24px", 
                  cursor: "pointer", 
                  color: "#6b7280",
                  transition: "color 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.color = "#374151"}
                onMouseOut={(e) => e.target.style.color = "#6b7280"}
              >
                ×
              </button>
            </div>

            <input 
              type="text" 
              placeholder="Search applicants by name or email..." 
              value={applicationSearchTerm} 
              onChange={(e) => setApplicationSearchTerm(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />

            {filteredApplications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <p style={{ color: "#6b7280", fontSize: "16px" }}>No applications found for this job.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "18px" }}>
                {filteredApplications.map((app) => (
                  <div 
                    key={app.applicationId} 
                    style={{
                      ...styles.jobCard,
                      borderLeft: `4px solid ${getStatusColor(app.status)}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", color: "#1f2937" }}>{app.applicant.name}</h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6b7280", fontSize: "14px" }}>
                          {app.applicant.email} • {app.applicant.phone}
                        </p>
                        <p style={{ margin: "0", color: "#6b7280", fontSize: "13px" }}>
                          Applied: {formatDate(app.applicant.applicationDate)}
                        </p>
                      </div>
                      <select 
                        value={app.status} 
                        onChange={(e) => updateApplicationStatus(app.applicationId, e.target.value)}
                        style={{ 
                          padding: "6px 12px", 
                          borderRadius: "6px", 
                          border: "none",
                          background: getStatusColor(app.status), 
                          color: "white",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                      >
                        <option value="Application Sent">Application Sent</option>
                        <option value="Viewed">Viewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    </div>
                    <p style={{ margin: "0 0 12px 0", fontSize: "14px", lineHeight: "1.5" }}>
                      <strong>Cover Letter:</strong> {app.applicant.coverLetter || "No cover letter provided"}
                    </p>
                    {app.applicant.resume && (
                      <button 
                        onClick={() => downloadResume(app)}
                        style={{
                          ...styles.button,
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          padding: "8px 16px",
                          fontSize: "13px"
                        }}
                        onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                        onMouseOut={(e) => Object.assign(e.target.style, { ...styles.button, background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" })}
                      >
                        📄 Download Resume
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Employer;

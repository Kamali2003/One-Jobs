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
    loadJobs();
    loadApplications();

    // Set up interval to check for changes
    const intervalId = setInterval(() => {
      loadApplications();
      loadJobs();
    }, 2000);

    return () => {
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
    setTimeout(() => setSuccessMessage(""), 3000);
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
    window.scrollTo(0, 0);
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
    loadJobs();
    loadApplications();
    alert("Data refreshed!");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ textAlign: "center", margin: 0 }}>
          Employer Dashboard
        </h1>
        <div>
          <button
            onClick={refreshData}
            style={{
              padding: "10px 15px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        backgroundColor: "#f3f4f6", 
        padding: "10px", 
        borderRadius: "5px", 
        marginBottom: "20px",
        fontSize: "14px",
        color: "#6b7280"
      }}>
        <strong>Debug Info:</strong> {applications.length} total applications, {jobs.length} jobs
        <br />
        <strong>Applications with jobId:</strong> {applications.filter(app => app.jobId).length}
        <br />
        <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", background: "#e3f2fd", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3>Total Jobs</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>{stats.totalJobs}</p>
        </div>
        <div style={{ flex: "1 1 200px", background: "#f1f8e9", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3>Total Applicants</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>{stats.totalApplicants}</p>
        </div>
        <div style={{ flex: "1 1 200px", background: "#fff8e1", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3>Remote Jobs</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>{stats.remoteJobs}</p>
        </div>
      </div>

      {/* Job Post Form */}
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fafafa", padding: "25px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <h2 style={{ marginTop: 0 }}>{editingJobId ? "Edit Job" : "Post a New Job"}</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <input 
              type="text" 
              name="title" 
              placeholder="Job Title" 
              value={formData.title} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.title ? "1px solid red" : "1px solid #ccc" }}
            />
            {errors.title && <p style={{ color: "red", margin: "5px 0 0", fontSize: "14px" }}>{errors.title}</p>}
          </div>
          
          <div>
            <input 
              type="text" 
              name="company" 
              placeholder="Company" 
              value={formData.company} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.company ? "1px solid red" : "1px solid #ccc" }}
            />
            {errors.company && <p style={{ color: "red", margin: "5px 0 0", fontSize: "14px" }}>{errors.company}</p>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <input 
              type="text" 
              name="location" 
              placeholder="Location" 
              value={formData.location} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.location ? "1px solid red" : "1px solid #ccc" }}
            />
            {errors.location && <p style={{ color: "red", margin: "5px 0 0", fontSize: "14px" }}>{errors.location}</p>}
          </div>
          
          <div>
            <input 
              type="text" 
              name="salary" 
              placeholder="Salary (e.g., $50,000 - $70,000)" 
              value={formData.salary} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <select 
              name="workMode" 
              value={formData.workMode} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
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
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <input 
              type="text" 
              name="experience" 
              placeholder="Experience (e.g., 2+ years)" 
              value={formData.experience} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          
          <div>
            <input 
              type="text" 
              name="qualification" 
              placeholder="Qualification (e.g., Bachelor's Degree)" 
              value={formData.qualification} 
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Skills Required:</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input 
              type="text" 
              placeholder="Add skill" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <button 
              type="button" 
              onClick={addSkill}
              style={{ padding: "10px 15px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {formData.skills.map((skill, index) => (
              <span key={index} style={{ background: "#e3f2fd", padding: "5px 10px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "5px" }}>
                {skill}
                <button 
                  type="button" 
                  onClick={() => removeSkill(skill)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#666" }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <textarea 
            name="description" 
            placeholder="Job Description (minimum 50 characters)" 
            value={formData.description} 
            onChange={handleChange}
            rows="5"
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.description ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.description && <p style={{ color: "red", margin: "5px 0 0", fontSize: "14px" }}>{errors.description}</p>}
          <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0" }}>
            {formData.description.length}/50 characters
          </p>
        </div>

        {successMessage && (
          <div style={{ color: "green", marginBottom: "15px", padding: "10px", background: "#e8f5e8", borderRadius: "4px" }}>
            {successMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="submit"
            style={{ padding: "12px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            {editingJobId ? "Update Job" : "Post Job"}
          </button>
          {editingJobId && (
            <button 
              type="button" 
              onClick={resetForm}
              style={{ padding: "12px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Job Listings */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Your Job Postings</h2>
        
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", flex: "1 1 300px" }}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
            {jobs.length === 0 ? "You haven't posted any jobs yet." : "No jobs match your search."}
          </p>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {filteredJobs.map((job) => (
              <div key={job.id} style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>{job.title}</h3>
                    <p style={{ margin: "0 0 5px 0", color: "#666" }}>{job.company} • {job.location} • {job.workMode}</p>
                    <p style={{ margin: "0", color: "#666" }}>Posted: {job.datePosted} • Applicants: {job.applicants || 0}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => viewApplications(job)}
                      style={{ padding: "8px 12px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      View Applications ({job.applicants || 0})
                    </button>
                    <button 
                      onClick={() => handleEditJob(job)}
                      style={{ padding: "8px 12px", background: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      style={{ padding: "8px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Type:</strong> {job.jobType} • <strong>Experience:</strong> {job.experience} • <strong>Salary:</strong> {job.salary}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Skills:</strong> {job.skills.join(", ")}
                </div>
                <p style={{ margin: "0" }}>{job.description.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications Modal */}
      {selectedJobApplications && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>
                Applications for {selectedJobApplications.title}
                <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                  {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
                </div>
              </h2>
              <button 
                onClick={() => setSelectedJobApplications(null)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <input 
              type="text" 
              placeholder="Search applicants by name or email..." 
              value={applicationSearchTerm} 
              onChange={(e) => setApplicationSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
            />

            {filteredApplications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>No applications found for this job.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {filteredApplications.map((app) => (
                  <div key={app.applicationId} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 5px 0" }}>{app.applicant.name}</h4>
                        <p style={{ margin: "0 0 5px 0", color: "#666" }}>{app.applicant.email} • {app.applicant.phone}</p>
                        <p style={{ margin: "0", color: "#666" }}>Applied: {formatDate(app.applicant.applicationDate)}</p>
                      </div>
                      <select 
                        value={app.status} 
                        onChange={(e) => updateApplicationStatus(app.applicationId, e.target.value)}
                        style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ccc", background: getStatusColor(app.status), color: "white" }}
                      >
                        <option value="Application Sent">Application Sent</option>
                        <option value="Viewed">Viewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    </div>
                    <p style={{ margin: "0 0 10px 0" }}><strong>Cover Letter:</strong> {app.applicant.coverLetter || "No cover letter provided"}</p>
                    {app.applicant.resume && (
                      <button 
                        onClick={() => downloadResume(app)}
                        style={{ padding: "5px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Download Resume
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
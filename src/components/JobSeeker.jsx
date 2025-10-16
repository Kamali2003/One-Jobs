import React, { useState, useEffect, useCallback } from "react";

const JobSeeker = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWorkMode, setFilterWorkMode] = useState("All");
  const [filterJobType, setFilterJobType] = useState("All");
  const [filterExperience, setFilterExperience] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicantData, setApplicantData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: ""
  });

  const [activeTab, setActiveTab] = useState("browse");
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    viewed: 0,
    shortlisted: 0,
    interview: 0,
    rejected: 0
  });

  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentJobData, setCurrentJobData] = useState(null);

  const loadApplications = useCallback(() => {
    const savedApplications = localStorage.getItem("jobApplications");
    if (savedApplications) {
      const parsedApplications = JSON.parse(savedApplications);
      setApplications(parsedApplications);
      calculateStats(parsedApplications);
    }
  }, []);

  useEffect(() => {
    const savedJobs = localStorage.getItem("employerJobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }

    const savedAppliedJobs = localStorage.getItem("appliedJobs");
    if (savedAppliedJobs) {
      setAppliedJobs(new Set(JSON.parse(savedAppliedJobs)));
    }

    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "jobApplications") {
        loadApplications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadApplications]);

  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(Array.from(appliedJobs)));
  }, [appliedJobs]);

  const calculateStats = (apps) => {
    const stats = {
      total: apps.length,
      applied: apps.filter(app => app.status === "Application Sent").length,
      viewed: apps.filter(app => app.status === "Viewed").length,
      shortlisted: apps.filter(app => app.status === "Shortlisted").length,
      interview: apps.filter(app => app.status === "Interview Scheduled").length,
      rejected: apps.filter(app => app.status === "Rejected").length
    };
    setStats(stats);
  };

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

  const getStatusIcon = (status) => {
    switch(status) {
      case "Application Sent": return "📤";
      case "Viewed": return "👀";
      case "Shortlisted": return "📋";
      case "Interview Scheduled": return "📅";
      case "Rejected": return "❌";
      case "Accepted": return "✅";
      default: return "📋";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleWithdrawApplication = (application) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      
      const updatedApplications = applications.filter(app => app.applicationId !== application.applicationId);
      setApplications(updatedApplications);
      localStorage.setItem("jobApplications", JSON.stringify(updatedApplications));
      calculateStats(updatedApplications);
      
      
      const savedJobs = localStorage.getItem("employerJobs");
      if (savedJobs) {
        const jobs = JSON.parse(savedJobs);
        const updatedJobs = jobs.map(job => {
          if (job.id.toString() === application.jobId) {
            return {
              ...job,
              applicants: Math.max(0, (job.applicants || 0) - 1)
            };
          }
          return job;
        });
        localStorage.setItem("employerJobs", JSON.stringify(updatedJobs));
        setJobs(updatedJobs);
      }

      const newAppliedJobs = new Set(appliedJobs);
      newAppliedJobs.delete(parseInt(application.jobId));
      setAppliedJobs(newAppliedJobs);
      
      alert("Application withdrawn successfully!");
    }
  };

  const filteredApplications = applications
    .filter(app => filterStatus === "All" || app.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.applicant.applicationDate);
      const dateB = new Date(b.applicant.applicationDate);
      
      if (sortBy === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const handleApplyClick = (job) => {
    console.log("Applying to job:", job);

    if (!job || !job.id) {
      console.error("Invalid job data:", job);
      alert("Error: Invalid job data. Please try again.");
      return;
    }

    setCurrentJobId(job.id);
    setCurrentJobData({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary,
      skills: job.skills,
      description: job.description
    });

    setApplicantData({
      name: "",
      email: "",
      phone: "",
      resume: null,
      coverLetter: ""
    });
    
    setShowApplicationModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicantData({
      ...applicantData,
      [name]: value
    });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setApplicantData({
          ...applicantData,
          resume: {
            file: file,
            content: event.target.result,
            name: file.name
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitApplication = () => {
    console.log("submitApplication called");
    console.log("currentJobId:", currentJobId);
    console.log("currentJobData:", currentJobData);

    console.log("Available jobs:", jobs);

    let jobToApply = currentJobData;
    let jobIdToUse = currentJobId;

    if (!jobToApply && jobIdToUse) {
      jobToApply = jobs.find(job => job.id === jobIdToUse);
      console.log("Found job from jobs list:", jobToApply);
    }
    
    if (!jobToApply) {
      const savedJobs = localStorage.getItem("employerJobs");
      if (savedJobs) {
        const parsedJobs = JSON.parse(savedJobs);
        jobToApply = parsedJobs.find(job => job.id === jobIdToUse);
        console.log("Found job from localStorage:", jobToApply);
      }
    }

    if (!jobToApply) {
      console.error("Missing job data:", { jobToApply, jobIdToUse, jobs });
      alert("Error: Job information is missing. Please try applying again. Make sure jobs exist in the system.");
      setShowApplicationModal(false);
      setCurrentJobId(null);
      setCurrentJobData(null);
      return;
    }

    if (!jobIdToUse && jobToApply.id) {
      jobIdToUse = jobToApply.id;
    }

    if (!applicantData.name || !applicantData.email || !applicantData.resume) {
      alert("Please fill in all required fields (Name, Email, and Resume)");
      return;
    }

    const applicationId = Date.now().toString();

    const application = {
      applicationId: applicationId,
      jobId: jobIdToUse.toString(),
      jobTitle: jobToApply.title || "Unknown Title",
      company: jobToApply.company || "Unknown Company",
      location: jobToApply.location || "Unknown Location",
      workMode: jobToApply.workMode || "Not specified",
      jobType: jobToApply.jobType || "Not specified",
      experience: jobToApply.experience || "Not specified",
      salary: jobToApply.salary || "Not specified",
      applicant: {
        name: applicantData.name,
        email: applicantData.email,
        phone: applicantData.phone,
        resume: applicantData.resume,
        coverLetter: applicantData.coverLetter,
        applicationDate: new Date().toISOString()
      },
      status: "Application Sent"
    };

    console.log("Submitting application:", application);

    const existingApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    const updatedApplications = [...existingApplications, application];

    setApplications(updatedApplications);
    localStorage.setItem("jobApplications", JSON.stringify(updatedApplications));
    calculateStats(updatedApplications);

    const newAppliedJobs = new Set(appliedJobs);
    newAppliedJobs.add(jobIdToUse);
    setAppliedJobs(newAppliedJobs);

    const updatedJobs = jobs.map(job => 
      job.id === jobIdToUse 
        ? { ...job, applicants: (job.applicants || 0) + 1 }
        : job
    );

    setJobs(updatedJobs);
    localStorage.setItem("employerJobs", JSON.stringify(updatedJobs));

    setApplicantData({
      name: "",
      email: "",
      phone: "",
      resume: null,
      coverLetter: ""
    });
    setShowApplicationModal(false);
    setCurrentJobId(null);
    setCurrentJobData(null);
    
    alert("Application submitted successfully!");
  };

  const handleWithdrawJob = (jobId) => {
    const applicationToWithdraw = applications.find(app => app.jobId === jobId.toString());
    if (applicationToWithdraw) {
      handleWithdrawApplication(applicationToWithdraw);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.skills && job.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    const matchesWorkMode = filterWorkMode === "All" || job.workMode === filterWorkMode;
    const matchesJobType = filterJobType === "All" || job.jobType === filterJobType;
    
    const matchesExperience = filterExperience === "All" || 
      (job.experience && job.experience.toLowerCase().includes(filterExperience.toLowerCase()));
    
    const matchesLocation = !filterLocation || 
      (job.location && job.location.toLowerCase().includes(filterLocation.toLowerCase()));
    
    return matchesSearch && matchesWorkMode && matchesJobType && matchesExperience && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterWorkMode("All");
    setFilterJobType("All");
    setFilterExperience("All");
    setFilterLocation("");
  };

  const JobCard = ({ job, onApply, onWithdraw, isApplied }) => {
    return (
      <div style={{ 
        padding: "20px", 
        border: "1px solid #e5e7eb", 
        borderRadius: "12px", 
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "18px" }}>
              {job.title}
            </h3>
            <p style={{ margin: "0 0 8px 0", color: "#374151", fontWeight: "500" }}>
              {job.company} • {job.location} • {job.workMode}
            </p>
            <p style={{ margin: "0 0 12px 0", color: "#6b7280", fontSize: "14px" }}>
              {job.jobType} • {job.experience} • {job.salary}
            </p>
            {job.skills && job.skills.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <strong>Skills:</strong> {job.skills.join(", ")}
              </div>
            )}
            <p style={{ margin: "0", color: "#6b7280" }}>
              {job.description?.substring(0, 100)}...
            </p>
          </div>
          <button
            onClick={() => isApplied ? onWithdraw(job.id) : onApply(job)}
            style={{
              padding: "10px 20px",
              backgroundColor: isApplied ? "#dc3545" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              minWidth: "120px"
            }}
          >
            {isApplied ? "Withdraw" : "Apply"}
          </button>
        </div>
      </div>
    );
  };

  const renderTracker = () => {
    if (applications.length === 0) {
      return (
        <div style={{ 
          padding: "60px 20px", 
          textAlign: "center", 
          backgroundColor: "white", 
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          margin: "40px auto"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📋</div>
          <h2 style={{ color: "#374151", marginBottom: "16px", fontSize: "24px" }}>No Applications Yet</h2>
          <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "16px", lineHeight: "1.5" }}>
            You haven't applied to any jobs yet. Start browsing available positions to kickstart your career journey.
          </p>
          <button
            onClick={() => setActiveTab("browse")}
            style={{
              padding: "14px 32px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            Browse Jobs
          </button>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#1f2937", marginBottom: "8px", fontSize: "28px", fontWeight: "700" }}>
            Application Tracker
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Track all your job applications in one place
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", 
          marginBottom: "32px"
        }}>
          <div style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6", marginBottom: "8px" }}>
              {stats.total}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Total Applications</div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b", marginBottom: "8px" }}>
              {stats.viewed}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Viewed</div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6", marginBottom: "8px" }}>
              {stats.shortlisted}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Shortlisted</div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", marginBottom: "8px" }}>
              {stats.interview}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Interviews</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <label style={{ color: "#374151", fontWeight: "500" }}>Filter by:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "white"
              }}
            >
              <option value="All">All Status</option>
              <option value="Application Sent">Application Sent</option>
              <option value="Viewed">Viewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <label style={{ color: "#374151", fontWeight: "500" }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "white"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {filteredApplications.map((application) => (
            <div
              key={application.applicationId}
              style={{
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "18px", fontWeight: "600" }}>
                    {application.jobTitle}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "#374151", fontWeight: "500", fontSize: "16px" }}>
                    {application.company}
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: "14px" }}>
                    {application.location}
                  </p>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{getStatusIcon(application.status)}</span>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      backgroundColor: getStatusColor(application.status),
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "16px", 
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px"
              }}>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#6b7280" }}>Applied on</p>
                  <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                    {formatDate(application.applicant.applicationDate)}
                  </p>
                </div>
                
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#6b7280" }}>Work Mode</p>
                  <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                    {application.workMode || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#6b7280" }}>Job Type</p>
                  <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                    {application.jobType || "Not specified"}
                  </p>
                </div>
              </div>
              
              {application.applicant.coverLetter && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Your cover letter:</p>
                  <div style={{ 
                    padding: "16px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px", 
                    border: "1px solid #e9ecef",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "#495057"
                  }}>
                    "{application.applicant.coverLetter}"
                  </div>
                </div>
              )}
              
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    alert(`Viewing job: ${application.jobTitle} at ${application.company}`);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                >
                  <span>👀</span> View Job Details
                </button>
                
                <button
                  onClick={() => handleWithdrawApplication(application)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f8f9fa",
                    color: "#dc3545",
                    border: "1px solid #dc3545",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                    e.target.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.color = "#dc3545";
                  }}
                >
                  <span>🗑️</span> Withdraw Application
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && applications.length > 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            backgroundColor: "white", 
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: "#374151", marginBottom: "8px" }}>No applications match your filter</h3>
            <p style={{ color: "#6b7280" }}>Try changing your filter settings to see more applications.</p>
          </div>
        )}
      </div>
    );
  };

  const renderJobSearch = () => {
    return (
      <div>
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#333" }}>Filter Jobs</h3>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, company, or skills"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Work Mode</label>
              <select
                value={filterWorkMode}
                onChange={(e) => setFilterWorkMode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  backgroundColor: "white"
                }}
              >
                <option value="All">All Work Modes</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Job Type</label>
              <select
                value={filterJobType}
                onChange={(e) => setFilterJobType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  backgroundColor: "white"
                }}
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Experience Level</label>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  backgroundColor: "white"
                }}
              >
                <option value="All">All Experience Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Location</label>
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="City, state, or remote"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: "16px", color: "#333" }}>
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
          </h2>
          
          {filteredJobs.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px", 
              backgroundColor: "white", 
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
              <h3 style={{ color: "#374151", marginBottom: "16px" }}>No jobs found</h3>
              <p style={{ color: "#6b7280", marginBottom: "24px" }}>
                Try adjusting your search filters or search terms to find more jobs.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApplyClick}
                  onWithdraw={handleWithdrawJob}
                  isApplied={appliedJobs.has(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApplicationModal = () => {
    if (!showApplicationModal) return null;

    const jobToShow = currentJobData || jobs.find(job => job.id === currentJobId);
    
    if (!jobToShow) {
      return (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            textAlign: "center"
          }}>
            <h2 style={{ marginBottom: "24px", color: "#1f2937" }}>Error</h2>
            <p>Job information is missing. Please close this window and try again.</p>
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setCurrentJobId(null);
                setCurrentJobData(null);
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "20px"
              }}
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
          <h2 style={{ marginBottom: "24px", color: "#1f2937" }}>
            Apply for {jobToShow.title} at {jobToShow.company}
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={applicantData.name}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box"
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={applicantData.email}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box"
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={applicantData.phone}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Resume *
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              style={{
                width: "100%",
                padding: "10px 0"
              }}
              required
            />
            {applicantData.resume && (
              <p style={{ margin: "8px 0 0 0", color: "#059669", fontSize: "14px" }}>
                ✓ {applicantData.resume.name}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Cover Letter (Optional)
            </label>
            <textarea
              name="coverLetter"
              value={applicantData.coverLetter}
              onChange={handleInputChange}
              placeholder="Why are you interested in this position?"
              rows="4"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            />
          </div>
          
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setCurrentJobId(null);
                setCurrentJobData(null);
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Cancel
            </button>
            <button
              onClick={submitApplication}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        marginBottom: "32px",
        borderBottom: "2px solid #e5e7eb"
      }}>
        <button
          onClick={() => setActiveTab("browse")}
          style={{
            padding: "16px 32px",
            backgroundColor: activeTab === "browse" ? "#3b82f6" : "transparent",
            color: activeTab === "browse" ? "white" : "#6b7280",
            border: "none",
            borderBottom: activeTab === "browse" ? "2px solid #3b82f6" : "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.2s",
            marginBottom: "-2px"
          }}
        >
          Browse Jobs
        </button>
        <button
          onClick={() => setActiveTab("tracker")}
          style={{
            padding: "16px 32px",
            backgroundColor: activeTab === "tracker" ? "#3b82f6" : "transparent",
            color: activeTab === "tracker" ? "white" : "#6b7280",
            border: "none",
            borderBottom: activeTab === "tracker" ? "2px solid #3b82f6" : "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.2s",
            marginBottom: "-2px"
          }}
        >
          Application Tracker
          {applications.length > 0 && (
            <span style={{
              marginLeft: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px"
            }}>
              {applications.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "browse" ? renderJobSearch() : renderTracker()}

      {renderApplicationModal()}
    </div>
  );
};

export default JobSeeker;
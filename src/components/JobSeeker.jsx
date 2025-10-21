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
  const [modalAnimation, setModalAnimation] = useState("");

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
    
    setModalAnimation("fadeIn");
    setShowApplicationModal(true);
  };

  const closeModal = () => {
    setModalAnimation("fadeOut");
    setTimeout(() => {
      setShowApplicationModal(false);
      setCurrentJobId(null);
      setCurrentJobData(null);
      setModalAnimation("");
    }, 300);
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
      closeModal();
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
    
    // Add success animation before closing
    setModalAnimation("success");
    setTimeout(() => {
      closeModal();
      alert("Application submitted successfully!");
    }, 600);
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
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        style={{ 
          padding: "20px", 
          border: "1px solid #e5e7eb", 
          borderRadius: "12px", 
          backgroundColor: "white",
          boxShadow: isHovered ? "0 10px 25px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: "0 0 8px 0", 
              color: "#111827", 
              fontSize: "18px",
              transition: "color 0.2s ease"
            }}>
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
              minWidth: "120px",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease",
              boxShadow: isHovered ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none"
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
          margin: "40px auto",
          animation: "fadeInUp 0.6s ease"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px", animation: "bounce 2s infinite" }}>📋</div>
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
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#3b82f6";
              e.target.style.transform = "scale(1)";
            }}
          >
            Browse Jobs
          </button>
        </div>
      );
    }

    return (
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ 
            color: "#1f2937", 
            marginBottom: "8px", 
            fontSize: "28px", 
            fontWeight: "700",
            animation: "slideInDown 0.5s ease"
          }}>
            Application Tracker
          </h1>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "16px",
            animation: "slideInDown 0.5s ease 0.1s both"
          }}>
            Track all your job applications in one place
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", 
          marginBottom: "32px"
        }}>
          {[
            { value: stats.total, label: "Total Applications", color: "#3b82f6", delay: 0 },
            { value: stats.viewed, label: "Viewed", color: "#f59e0b", delay: 0.1 },
            { value: stats.shortlisted, label: "Shortlisted", color: "#8b5cf6", delay: 0.2 },
            { value: stats.interview, label: "Interviews", color: "#10b981", delay: 0.3 }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              style={{ 
                backgroundColor: "white", 
                padding: "20px", 
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
                animation: `slideInUp 0.5s ease ${stat.delay}s both`,
                transform: "translateY(0)",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ 
                fontSize: "32px", 
                fontWeight: "bold", 
                color: stat.color, 
                marginBottom: "8px" 
              }}>
                {stat.value}
              </div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>{stat.label}</div>
            </div>
          ))}
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
          gap: "16px",
          animation: "fadeIn 0.6s ease 0.4s both"
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
                backgroundColor: "white",
                transition: "all 0.2s ease"
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
                backgroundColor: "white",
                transition: "all 0.2s ease"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {filteredApplications.map((application, index) => (
            <div
              key={application.applicationId}
              style={{
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                animation: `slideInRight 0.5s ease ${index * 0.1}s both`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
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
                      letterSpacing: "0.5px",
                      transition: "all 0.3s ease"
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
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.transform = "scale(1)";
                  }}
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
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                    e.target.style.color = "white";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.color = "#dc3545";
                    e.target.style.transform = "scale(1)";
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
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            animation: "fadeIn 0.5s ease"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "pulse 2s infinite" }}>🔍</div>
            <h3 style={{ color: "#374151", marginBottom: "8px" }}>No applications match your filter</h3>
            <p style={{ color: "#6b7280" }}>Try changing your filter settings to see more applications.</p>
          </div>
        )}
      </div>
    );
  };

  const renderJobSearch = () => {
    return (
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "24px",
          animation: "slideInDown 0.5s ease"
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
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4b5563";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#6b7280";
                e.target.style.transform = "scale(1)";
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { label: "Search", type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Job title, company, or skills" },
              { label: "Work Mode", type: "select", value: filterWorkMode, onChange: (e) => setFilterWorkMode(e.target.value), options: ["All", "On-site", "Remote", "Hybrid"] },
              { label: "Job Type", type: "select", value: filterJobType, onChange: (e) => setFilterJobType(e.target.value), options: ["All", "Full-time", "Part-time", "Contract", "Internship", "Freelance"] },
              { label: "Experience Level", type: "select", value: filterExperience, onChange: (e) => setFilterExperience(e.target.value), options: ["All", "Entry Level", "Junior", "Mid Level", "Senior", "Lead", "Executive"] },
              { label: "Location", type: "text", value: filterLocation, onChange: (e) => setFilterLocation(e.target.value), placeholder: "City, state, or remote" }
            ].map((field, index) => (
              <div key={field.label} style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s both` }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={field.value}
                    onChange={field.onChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
                      transition: "all 0.2s ease"
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ 
            marginBottom: "16px", 
            color: "#333",
            animation: "fadeIn 0.5s ease 0.3s both"
          }}>
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
          </h2>
          
          {filteredJobs.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px", 
              backgroundColor: "white", 
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              animation: "fadeIn 0.5s ease"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px", animation: "bounce 2s infinite" }}>🔍</div>
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
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#2563eb";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#3b82f6";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredJobs.map((job, index) => (
                <div 
                  key={job.id}
                  style={{ animation: `slideInUp 0.5s ease ${index * 0.1}s both` }}
                >
                  <JobCard
                    job={job}
                    onApply={handleApplyClick}
                    onWithdraw={handleWithdrawJob}
                    isApplied={appliedJobs.has(job.id)}
                  />
                </div>
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
          padding: "20px",
          animation: modalAnimation === "fadeIn" ? "fadeIn 0.3s ease" : 
                    modalAnimation === "fadeOut" ? "fadeOut 0.3s ease" : "fadeIn 0.3s ease"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            textAlign: "center",
            animation: modalAnimation === "fadeIn" ? "scaleIn 0.3s ease" : 
                      modalAnimation === "fadeOut" ? "scaleOut 0.3s ease" : "scaleIn 0.3s ease"
          }}>
            <h2 style={{ marginBottom: "24px", color: "#1f2937" }}>Error</h2>
            <p>Job information is missing. Please close this window and try again.</p>
            <button
              onClick={closeModal}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "20px",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4b5563";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#6b7280";
                e.target.style.transform = "scale(1)";
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
        padding: "20px",
        animation: modalAnimation === "fadeIn" ? "fadeIn 0.3s ease" : 
                  modalAnimation === "fadeOut" ? "fadeOut 0.3s ease" :
                  modalAnimation === "success" ? "pulse 0.6s ease" : "fadeIn 0.3s ease"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: modalAnimation === "fadeIn" ? "scaleIn 0.3s ease" : 
                    modalAnimation === "fadeOut" ? "scaleOut 0.3s ease" :
                    modalAnimation === "success" ? "bounce 0.6s ease" : "scaleIn 0.3s ease"
        }}>
          <h2 style={{ marginBottom: "24px", color: "#1f2937" }}>
            Apply for {jobToShow.title} at {jobToShow.company}
          </h2>
          
          {[
            { label: "Full Name *", type: "text", name: "name", value: applicantData.name, required: true },
            { label: "Email Address *", type: "email", name: "email", value: applicantData.email, required: true },
            { label: "Phone Number", type: "tel", name: "phone", value: applicantData.phone, required: false }
          ].map((field, index) => (
            <div key={field.name} style={{ marginBottom: "20px", animation: `slideInLeft 0.5s ease ${index * 0.1}s both` }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease"
                }}
                required={field.required}
              />
            </div>
          ))}
          
          <div style={{ marginBottom: "20px", animation: "slideInLeft 0.5s ease 0.3s both" }}>
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
          
          <div style={{ marginBottom: "24px", animation: "slideInLeft 0.5s ease 0.4s both" }}>
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
                resize: "vertical",
                transition: "all 0.2s ease"
              }}
            />
          </div>
          
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            justifyContent: "flex-end",
            animation: "fadeIn 0.5s ease 0.5s both"
          }}>
            <button
              onClick={closeModal}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4b5563";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#6b7280";
                e.target.style.transform = "scale(1)";
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
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#2563eb";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#3b82f6";
                e.target.style.transform = "scale(1)";
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
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
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
          @keyframes slideInDown {
            from { 
              opacity: 0;
              transform: translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInLeft {
            from { 
              opacity: 0;
              transform: translateX(-30px);
            }
            to { 
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from { 
              opacity: 0;
              transform: translateX(30px);
            }
            to { 
              opacity: 1;
              transform: translateX(0);
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
          @keyframes scaleOut {
            from { 
              opacity: 1;
              transform: scale(1);
            }
            to { 
              opacity: 0;
              transform: scale(0.8);
            }
          }
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translateY(0);
            }
            40%, 43% {
              transform: translateY(-10px);
            }
            70% {
              transform: translateY(-5px);
            }
            90% {
              transform: translateY(-2px);
            }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        marginBottom: "32px",
        borderBottom: "2px solid #e5e7eb"
      }}>
        {["browse", "tracker"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "16px 32px",
              backgroundColor: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "white" : "#6b7280",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #3b82f6" : "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.3s ease",
              marginBottom: "-2px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {tab === "browse" ? "Browse Jobs" : "Application Tracker"}
            {tab === "tracker" && applications.length > 0 && (
              <span style={{
                marginLeft: "8px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "12px",
                animation: "pulse 2s infinite"
              }}>
                {applications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "browse" ? renderJobSearch() : renderTracker()}

      {renderApplicationModal()}
    </div>
  );
};

export default JobSeeker;

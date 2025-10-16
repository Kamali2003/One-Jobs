import React, { useState } from "react";

const JobCard = ({ job, onApply, onWithdraw }) => {
  const [expanded, setExpanded] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleApply = () => {
    if (!isApplied) {
      setIsApplied(true);
      if (onApply) {
        onApply(job.id);
      }
    }
  };

  const handleWithdraw = () => {
    if (isApplied) {
      setIsApplied(false);
      if (onWithdraw) {
        onWithdraw(job.id);
      }
      setShowDeleteConfirm(false);
    }
  };

  const toggleDeleteConfirm = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(!showDeleteConfirm);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "No description available";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getWorkModeColor = (workMode) => {
    if (!workMode) return '#6b7280';
    
    switch(workMode.toLowerCase()) {
      case 'remote': return '#10b981';
      case 'hybrid': return '#f59e0b';
      case 'on-site': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc, #ffffff)",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        border: isApplied ? "2px solid #10b981" : "2px solid transparent",
        position: "relative",
        overflow: "hidden",
        marginBottom: "20px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
      }}
      onClick={() => setExpanded(!expanded)}
    >

      {isApplied && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          gap: "8px"
        }}>
          {showDeleteConfirm ? (
            <>
              <button
                onClick={handleWithdraw}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px"
                }}
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px"
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={toggleDeleteConfirm}
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Withdraw
            </button>
          )}
        </div>
      )}

      {isApplied && (
        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          backgroundColor: "#10b981",
          color: "white",
          fontSize: "12px",
          fontWeight: "600",
          padding: "4px 10px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
          </svg>
          Applied
        </div>
      )}

      <div style={{
        width: "60px",
        height: "60px",
        backgroundColor: "#e5e7eb",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#4b5563"
      }}>
        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
      </div>

      <h2 style={{ 
        fontSize: "20px", 
        fontWeight: "700", 
        marginBottom: "6px", 
        color: "#111827",
        lineHeight: "1.3"
      }}>
        {job.title}
      </h2>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px"
      }}>
        <h4 style={{ 
          fontSize: "16px", 
          fontWeight: "500", 
          color: "#374151", 
          margin: 0
        }}>
          {job.company}
        </h4>
        <span style={{
          backgroundColor: getWorkModeColor(job.workMode),
          color: "white",
          fontSize: "12px",
          fontWeight: "600",
          padding: "4px 10px",
          borderRadius: "20px"
        }}>
          {job.workMode || "Not specified"}
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
        fontSize: "13px",
        color: "##6b7280"
      }}>
        <span>Posted: {job.datePosted ? new Date(job.datePosted).toLocaleDateString() : "Not specified"}</span>
        <span>•</span>
        <span>{job.applicants || 0} applicants</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#4b5563"/>
          </svg>
          <span style={{ fontSize: "14px", color: "#374151" }}>{job.location || "Not specified"}</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 极狐 6.48 17.52 2 12 2ZM16.36 14.53C16.25 14.92 15.9 15.2 15.5 15.2极狐 8.5C8.10 15.2 7.75 14.92 7.64 14.53C7.53 14.14 7.67 13.73 8 13.5L11 11.3V7.5C11 7.1 11.32 6.75 11.72 6.75H12.28C12.68 6.75 13 7.1 13 7.5V11.3L16 13.5C16.33 13.73 16.47 14.14 16.36 14.53Z" fill="#4b5563"/>
          </svg>
          <span style={{ fontSize: "14px", color: "#374151" }}>{job.salary || "Not specified"}</span>
        </div>
        
        <div style={{ display: "极狐", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.6 15.6L12 13.3L8.4 15.6L9.5 11.5L6.4 8.8L10.7 8.4极狐 12 4.5L13.3 8.4L17.6 8.8L14.5 11.5L15.6 15.6Z" fill="#4b5563"/>
          </svg>
          <span style={{ fontSize: "14px", color: "#374151" }}>{job.experience || "Not specified"}</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="极狐://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M4 6H20V8H4V6ZM4 10H20V12极狐 4V10ZM4 14H20V16H4V14ZM4 18H20V20H4V18Z" fill="#4b5563"/>
          </svg>
          <span style={{ fontSize: "14px", color: "#374151" }}>{job.qualification || "Not specified"}</span>
        </div>
      </div>

      <blockquote
        style={{
          marginTop: "16px",
          fontSize: "14px",
          color: "#4b5563",
          borderLeft: "3px solid #3b82f6",
          paddingLeft: "12px",
          lineHeight: "1.5"
        }}
      >
        {expanded ? (job.description || "No description available") : truncateText(job.description, 120)}
        {job.description && job.description.length > 120 && (
          <button 
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontWeight: "600",
              cursor: "pointer",
              marginLeft: "4px"
            }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>

      {job.skills && job.skills.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin极狐: "8px" }}>
            Required Skills:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {job.skills.map((skill, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: "20px", 
        display: "flex", 
        gap: "12px",
        justifyContent: "flex-end"
      }}>
        {!isApplied ? (
          <button
            onClick={handleApply}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19极狐 13Z" fill="currentColor"/>
            </svg>
            Apply
          </button>
        ) : (
          <button
            onClick={toggleDeleteConfirm}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#fee2e2",
              color: "#dc2626",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#fee2e2";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
            Withdraw Application
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
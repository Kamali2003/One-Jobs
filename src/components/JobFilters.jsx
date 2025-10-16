import React, { useState } from "react";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></link>
const JobFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: "",
    role: "",
    experience: "",
    workMode: "",
    minSalary: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      location: "",
      role: "",
      experience: "",
      workMode: "",
      minSalary: ""
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0f4ff, #e6f0fa)",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        maxWidth: "320px",
        height: "fit-content",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#2d3748", fontSize: "20px", fontWeight: "600" }}>
          Filter Jobs
          {activeFilterCount > 0 && (
            <span style={{
              marginLeft: "8px",
              backgroundColor: "#4f46e5",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px"
            }}>
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={clearFilters}
          style={{
            padding: "8px 14px",
            backgroundColor: activeFilterCount > 0 ? "#4f46e5" : "#cbd5e0",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: activeFilterCount > 0 ? "pointer" : "not-allowed",
            fontSize: "13px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            opacity: activeFilterCount > 0 ? 1 : 0.7
          }}
        >
          Clear All
        </button>
      </div>

      {activeFilterCount > 0 && (
        <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            let displayText = value;
            if (key === "minSalary") displayText = `Salary: ${value}K`;
            
            return (
              <span
                key={key}
                style={{
                  backgroundColor: "#e0e7ff",
                  color: "#4f46e5",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                {displayText}
                <button
                  onClick={() => {
                    const newFilters = { ...filters, [key]: "" };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    marginLeft: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="location" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
          <i className="fas fa-map-marker-alt" style={{ marginRight: "8px", color: "#6b7280" }}></i>
          Location:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="City or country"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            fontSize: "14px",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="role" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
          <i className="fas fa-briefcase" style={{ marginRight: "8px", color: "#6b7280" }}></i>
          Role:
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={filters.role}
          onChange={handleChange}
          placeholder="Job title or role"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            fontSize: "14px",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="experience" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
          <i className="fas fa-chart-line" style={{ marginRight: "8px", color: "#6b7280" }}></i>
          Experience Level:
        </label>
        <select
          id="experience"
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            backgroundColor: "white",
            fontSize: "14px",
            appearance: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "18px",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="">Any experience</option>
          <option value="Internship">Internship</option>
          <option value="Entry-level">Entry-level (0-2 years)</option>
          <option value="Mid-level">Mid-level (2-5 years)</option>
          <option value="Senior">Senior (5+ years)</option>
          <option value="Executive">Executive</option>
        </select>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="workMode" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
          <i className="fas fa-laptop-house" style={{ marginRight: "8px", color: "#6b7280" }}></i>
          Work Mode:
        </label>
        <select
          id="workMode"
          name="workMode"
          value={filters.workMode}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            backgroundColor: "white",
            fontSize: "14px",
            appearance: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "18px",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="">Any work mode</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="minSalary" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
          <i className="fas fa-money-bill-wave" style={{ marginRight: "8px", color: "#6b7280" }}></i>
          Minimum Salary (K):
        </label>
        <input
          type="number"
          id="minSalary"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleChange}
          placeholder="e.g., 50"
          min="0"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            fontSize: "14px",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
};

export default JobFilters;
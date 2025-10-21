import React, { useState, useEffect } from "react";

const JobFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: "",
    role: "",
    experience: "",
    workMode: "",
    minSalary: ""
  });

  const [isVisible, setIsVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    // Animation on mount
    setIsVisible(true);
    
    // Update active filters display
    const active = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => ({ key, value }));
    setActiveFilters(active);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    if (activeFilters.length === 0) return;
    
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

  const removeFilter = (key) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = activeFilters.length;

  // Enhanced CSS styles with animations and gradients
  const styles = {
    container: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "30px 25px",
      borderRadius: "25px",
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 8px 25px rgba(102, 126, 234, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      maxWidth: "380px",
      minWidth: "350px",
      height: "fit-content",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(20px)",
      transform: isVisible ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.95)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      position: "relative",
      overflow: "hidden"
    },
    backgroundEffect: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
      animation: "rotate 20s linear infinite",
      pointerEvents: "none"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "28px",
      paddingBottom: "20px",
      borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
      position: "relative",
      zIndex: 2
    },
    title: {
      margin: 0,
      color: "white",
      fontSize: "26px",
      fontWeight: "800",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-0.5px",
      background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    filterBadge: {
      backgroundColor: "#ff6b6b",
      color: "white",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "800",
      animation: activeFilterCount > 0 ? "pulse 2s infinite, bounceIn 0.6s ease-out" : "none",
      boxShadow: "0 6px 20px rgba(255, 107, 107, 0.5)",
      border: "2px solid rgba(255, 255, 255, 0.3)"
    },
    clearButton: {
      padding: "12px 24px",
      background: hoveredButton ? 
        "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)" : 
        "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
      color: "white",
      border: "none",
      borderRadius: "15px",
      cursor: activeFilterCount > 0 ? "pointer" : "not-allowed",
      fontSize: "14px",
      fontWeight: "700",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: activeFilterCount > 0 ? 1 : 0.5,
      boxShadow: activeFilterCount > 0 ? 
        "0 8px 25px rgba(255, 107, 107, 0.4)" : 
        "0 4px 15px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transform: hoveredButton ? "translateY(-3px) scale(1.05)" : "translateY(0) scale(1)",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
    },
    activeFilters: {
      marginBottom: "28px",
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      animation: "fadeInUp 0.6s ease-out",
      position: "relative",
      zIndex: 2
    },
    activeFilterTag: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
      color: "white",
      padding: "10px 18px",
      borderRadius: "25px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      animation: "slideInUp 0.5s ease-out",
      transition: "all 0.3s ease",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
    },
    removeFilterButton: {
      background: "none",
      border: "none",
      color: "white",
      marginLeft: "10px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    filterGroup: {
      marginBottom: "26px",
      animation: "slideInUp 0.6s ease-out",
      position: "relative",
      zIndex: 2
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "700",
      color: "white",
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)"
    },
    icon: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "16px",
      width: "22px",
      textAlign: "center",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "15px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxSizing: "border-box",
      fontSize: "15px",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(15px)",
      color: "white",
      fontWeight: "500",
      boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)"
    },
    inputFocus: {
      borderColor: "rgba(255, 255, 255, 0.6)",
      boxShadow: `
        0 0 0 4px rgba(255, 255, 255, 0.2),
        inset 0 2px 10px rgba(0, 0, 0, 0.1)
      `,
      outline: "none",
      transform: "scale(1.02)",
      background: "rgba(255, 255, 255, 0.25)"
    },
    select: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "15px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxSizing: "border-box",
      background: "rgba(255, 255, 255, 0.15)",
      fontSize: "15px",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 18px center",
      backgroundSize: "20px",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(15px)",
      color: "white",
      fontWeight: "500",
      boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)"
    },
    selectOption: {
      background: "#667eea",
      color: "white",
      padding: "12px"
    },
    visualIndicator: {
      textAlign: "center",
      marginTop: "25px",
      padding: "16px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
      borderRadius: "18px",
      animation: activeFilterCount > 0 ? "pulseGlow 3s infinite, fadeIn 0.6s ease-out" : "none",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      position: "relative",
      zIndex: 2
    },
    indicatorText: {
      color: "white",
      fontSize: "14px",
      fontWeight: "700",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    }
  };

  // Add CSS animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-40px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(25px);
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
      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.8);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
        }
      }
      @keyframes pulseGlow {
        0% {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
        }
        50% {
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.3);
          background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
        }
        100% {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
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
      
      /* Input placeholder styling */
      input::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }
      
      select option {
        background: #667eea;
        color: white;
        padding: 12px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filterGroups = [
    {
      id: "location",
      label: "📍 Location",
      icon: "fas fa-map-marker-alt",
      type: "text",
      placeholder: "Enter city or country..."
    },
    {
      id: "role",
      label: "💼 Role",
      icon: "fas fa-briefcase",
      type: "text",
      placeholder: "Job title or role..."
    },
    {
      id: "experience",
      label: "📈 Experience",
      icon: "fas fa-chart-line",
      type: "select",
      options: [
        { value: "", label: "Any experience level" },
        { value: "Internship", label: "🎓 Internship" },
        { value: "Entry-level", label: "🚀 Entry-level (0-2 years)" },
        { value: "Mid-level", label: "💪 Mid-level (2-5 years)" },
        { value: "Senior", label: "🏆 Senior (5+ years)" },
        { value: "Executive", label: "👑 Executive" }
      ]
    },
    {
      id: "workMode",
      label: "🏠 Work Mode",
      icon: "fas fa-laptop-house",
      type: "select",
      options: [
        { value: "", label: "Any work mode" },
        { value: "Remote", label: "🌍 Remote" },
        { value: "Hybrid", label: "🔀 Hybrid" },
        { value: "On-site", label: "🏢 On-site" }
      ]
    },
    {
      id: "minSalary",
      label: "💰 Minimum Salary",
      icon: "fas fa-money-bill-wave",
      type: "number",
      placeholder: "e.g., 50000"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Animated background effect */}
      <div style={styles.backgroundEffect}></div>
      
      <div style={styles.header}>
        <h3 style={styles.title}>
          🔍 Filter Jobs
          {activeFilterCount > 0 && (
            <span style={styles.filterBadge}>
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={clearFilters}
          style={styles.clearButton}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          disabled={activeFilterCount === 0}
        >
          🗑️ Clear All
        </button>
      </div>

      {activeFilterCount > 0 && (
        <div style={styles.activeFilters}>
          {activeFilters.map(({ key, value }) => {
            let displayText = value;
            if (key === "minSalary") displayText = `$${value}`;
            
            const filterConfig = filterGroups.find(f => f.id === key);
            const displayLabel = filterConfig ? filterConfig.label.split(' ').slice(1).join(' ') : key;

            return (
              <span
                key={key}
                style={styles.activeFilterTag}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 100%)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {displayLabel}: {displayText}
                <button
                  onClick={() => removeFilter(key)}
                  style={styles.removeFilterButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.3)";
                    e.target.style.transform = "scale(1.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {filterGroups.map((filter, index) => (
        <div 
          key={filter.id}
          style={{
            ...styles.filterGroup,
            animationDelay: `${index * 0.1}s`
          }}
        >
          <label htmlFor={filter.id} style={styles.label}>
            {filter.label}
          </label>
          
          {filter.type === "select" ? (
            <select
              id={filter.id}
              name={filter.id}
              value={filters[filter.id]}
              onChange={handleChange}
              style={styles.select}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value} style={styles.selectOption}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={filter.type}
              id={filter.id}
              name={filter.id}
              value={filters[filter.id]}
              onChange={handleChange}
              placeholder={filter.placeholder}
              min={filter.type === "number" ? "0" : undefined}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          )}
        </div>
      ))}

      {/* Visual indicator when filters are active */}
      {activeFilterCount > 0 && (
        <div style={styles.visualIndicator}>
          <span style={styles.indicatorText}>
            🎯 {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
        </div>
      )}
    </div>
  );
};

export default JobFilters;

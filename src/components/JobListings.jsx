import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { useJobs } from './JobContext';

const JobListings = ({ showActions }) => {
  const { allJobs, applyForJob, deleteJob, appliedJobs } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: '',
    workMode: '',
    minSalary: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    filterJobs();
  }, [filters, allJobs]);

  useEffect(() => {
    // Count active filters
    const count = Object.values(filters).filter(value => value !== '').length;
    setActiveFilterCount(count);
  }, [filters]);

  const handleApply = (job) => {
    applyForJob(job.id);
  };

  const handleDelete = (jobId) => {
    deleteJob(jobId);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filterJobs = () => {
    let filtered = allJobs.filter(job => {
      // Title filter (case-insensitive partial match)
      const matchesTitle = !filters.title ||
        (job.title && job.title.toLowerCase().includes(filters.title.toLowerCase()));

      const matchesCompany = !filters.company || 
        (job.company && job.company.toLowerCase().includes(filters.company.toLowerCase()));

      const matchesLocation = !filters.location || 
        (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()));

      const matchesWorkMode = !filters.workMode || 
        job.workMode === filters.workMode;

      const matchesSalary = !filters.minSalary || checkSalaryMatch(job.salary, parseInt(filters.minSalary));
      
      return matchesTitle && matchesCompany && matchesLocation && matchesWorkMode && matchesSalary;
    });

    setFilteredJobs(filtered);
  };

  const checkSalaryMatch = (salary, minSalary) => {
    if (!salary) return false;

    if (typeof salary === 'object' && salary.min) {
      return salary.min >= minSalary;
    }

    if (typeof salary === 'number') {
      return salary >= minSalary;
    }

    if (typeof salary === 'string') {
      const numbers = salary.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const salaryValue = parseInt(numbers[0]);
        return salaryValue >= minSalary;
      }
    }
    
    return false;
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      company: '',
      location: '',
      workMode: '',
      minSalary: ''
    });
  };

  // Enhanced CSS styles with animations and gradients
  const styles = {
    container: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
      backgroundSize: "400% 400%",
      minHeight: '100vh',
      padding: '30px',
      borderRadius: '0',
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      animation: 'gradientShift 8s ease infinite',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundEffect: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%)
      `,
      animation: 'float 6s ease-in-out infinite',
      pointerEvents: 'none'
    },
    filterSection: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
      padding: '32px',
      borderRadius: '24px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 8px 25px rgba(102, 126, 234, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.5)
      `,
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      animation: 'slideInDown 0.8s ease-out',
      position: 'relative',
      zIndex: 2
    },
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
      paddingBottom: '24px',
      borderBottom: '2px solid rgba(102, 126, 234, 0.2)'
    },
    filterTitle: {
      margin: 0,
      color: 'white',
      fontSize: '28px',
      fontWeight: '800',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #1f2937 0%, #4f46e5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    filterBadge: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '800',
      animation: activeFilterCount > 0 ? 'pulse 2s infinite, bounceIn 0.8s ease-out' : 'none',
      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.5)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    clearButton: {
      padding: '14px 28px',
      background: hoveredButton ? 
        "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)" : 
        "linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(102, 126, 234, 0.8) 100%)",
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      cursor: activeFilterCount > 0 ? 'pointer' : 'not-allowed',
      fontSize: '15px',
      fontWeight: '700',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: activeFilterCount > 0 ? 1 : 0.5,
      boxShadow: activeFilterCount > 0 ? 
        '0 10px 30px rgba(255, 107, 107, 0.4)' : 
        '0 6px 20px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transform: hoveredButton ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      animation: 'fadeInUp 0.8s ease-out'
    },
    filterGroup: {
      animation: 'slideInUp 0.8s ease-out'
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      fontWeight: '700',
      color: '#374151',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxSizing: 'border-box',
      fontSize: '16px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
      fontWeight: '500'
    },
    inputFocus: {
      borderColor: '#4f46e5',
      boxShadow: `
        0 0 0 4px rgba(79, 70, 229, 0.2),
        inset 0 2px 10px rgba(0, 0, 0, 0.05)
      `,
      outline: 'none',
      transform: 'scale(1.02)',
      background: 'white'
    },
    select: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxSizing: 'border-box',
      background: 'rgba(255, 255, 255, 0.9)',
      fontSize: '16px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      appearance: 'none',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%234f46e5' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 20px center',
      backgroundSize: '20px',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
      fontWeight: '500'
    },
    resultsHeader: {
      marginBottom: '32px',
      padding: '28px',
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
      borderRadius: '20px',
      boxShadow: `
        0 15px 35px rgba(0, 0, 0, 0.1),
        0 8px 25px rgba(102, 126, 234, 0.15)
      `,
      border: '1px solid rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      animation: 'fadeIn 0.8s ease-out',
      position: 'relative',
      zIndex: 2
    },
    resTitle: {
      margin: 0,
      color: '#1f2937',
      fontSize: '26px',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: 'linear-gradient(135deg, #1f2937 0%, #4f46e5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    jobGrid: {
      display: 'grid',
      gap: '28px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
      animation: 'fadeIn 1s ease-out',
      position: 'relative',
      zIndex: 2
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 40px',
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
      borderRadius: '24px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 8px 25px rgba(102, 126, 234, 0.2)
      `,
      marginTop: '32px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      animation: 'zoomIn 0.8s ease-out',
      position: 'relative',
      zIndex: 2
    },
    emptyStateTitle: {
      color: '#374151',
      marginBottom: '20px',
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #1f2937 0%, #4f46e5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    emptyStateText: {
      color: '#6b7280',
      fontSize: '17px',
      lineHeight: '1.7',
      fontWeight: '500'
    }
  };

  // Add CSS animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
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
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.8);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
        }
      }
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      @keyframes float {
        0% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
        100% {
          transform: translateY(0px) rotate(360deg);
        }
      }
      @keyframes glow {
        0% {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
        }
        50% {
          box-shadow: 0 0 40px rgba(79, 70, 229, 0.8);
        }
        100% {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
        }
      }
      
      input::placeholder {
        color: rgba(107, 114, 128, 0.7);
        font-weight: 500;
      }
      
      select option {
        background: white;
        color: #374151;
        padding: 12px;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filterConfigs = [
    {
      name: 'title',
      label: '🎯 Job Title',
      placeholder: 'e.g., Fullstack Developer',
      type: 'text'
    },
    {
      name: 'company',
      label: '🏢 Company',
      placeholder: 'Company name',
      type: 'text'
    },
    {
      name: 'location',
      label: '📍 Location',
      placeholder: 'e.g., Chennai',
      type: 'text'
    },
    {
      name: 'workMode',
      label: '💼 Work Mode',
      type: 'select',
      options: [
        { value: '', label: 'All work modes' },
        { value: 'Remote', label: '🌍 Remote' },
        { value: 'Hybrid', label: '🔀 Hybrid' },
        { value: 'On-site', label: '🏢 On-site' }
      ]
    },
    {
      name: 'minSalary',
      label: '💰 Min Salary (₹)',
      placeholder: 'e.g., 500000',
      type: 'number'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background Effect */}
      <div style={styles.backgroundEffect}></div>
      
      {/* Filters Section */}
      <div style={styles.filterSection}>
        <div style={styles.filterHeader}>
          <h3 style={styles.filterTitle}>
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

        <div style={styles.filterGrid}>
          {filterConfigs.map((filter, index) => (
            <div 
              key={filter.name}
              style={{
                ...styles.filterGroup,
                animationDelay: `${index * 0.15}s`
              }}
            >
              <label style={styles.label}>
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  name={filter.name}
                  value={filters[filter.name]}
                  onChange={handleFilterChange}
                  style={styles.select}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.select)}
                >
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type}
                  name={filter.name}
                  value={filters[filter.name]}
                  onChange={handleFilterChange}
                  placeholder={filter.placeholder}
                  min={filter.type === 'number' ? '0' : undefined}
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={styles.resultsHeader}>
        <h3 style={styles.resTitle}>
          📊 Job Results
          <span style={{
            marginLeft: '16px',
            fontSize: '20px',
            color: '#4f46e5',
            fontWeight: '800',
            animation: 'pulse 2s infinite',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
          </span>
        </h3>
        {filteredJobs.length === 0 && allJobs.length > 0 && (
          <p style={{ 
            color: '#6b7280', 
            margin: '16px 0 0 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600'
          }}>
            ⚠️ No jobs match your current filters. Try adjusting your search criteria.
          </p>
        )}
      </div>

      {/* Jobs Grid */}
      <div style={styles.jobGrid}>
        {filteredJobs.map((job, index) => (
          <div
            key={job.id}
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'slideInUp 0.8s ease-out'
            }}
          >
            <JobCard
              job={job}
              showActions={showActions}
              onApply={() => handleApply(job)}
              onDelete={handleDelete}
              isApplied={appliedJobs.has(job.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {allJobs.length === 0 && (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyStateTitle}>🚀 No Jobs Available Yet</h3>
          <p style={styles.emptyStateText}>
            Check back later for exciting new job opportunities!<br />
            New positions are added regularly.
          </p>
          <div style={{
            marginTop: '32px',
            fontSize: '64px',
            animation: 'pulse 2s infinite, float 4s ease-in-out infinite'
          }}>
            💼
          </div>
        </div>
      )}

      {/* No Results State */}
      {allJobs.length > 0 && filteredJobs.length === 0 && (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyStateTitle}>🔍 No Matching Jobs Found</h3>
          <p style={styles.emptyStateText}>
            Try adjusting your filters or search terms to find more opportunities.
          </p>
          <div style={{
            marginTop: '32px',
            fontSize: '64px',
            animation: 'pulse 2s infinite, float 4s ease-in-out infinite'
          }}>
            📝
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;

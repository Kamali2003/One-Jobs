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

  useEffect(() => {
    filterJobs();
  }, [filters, allJobs]);

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

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0f4ff, #e6f0fa)",
        minHeight: '100vh',
        padding: '20px',
        borderRadius: '12px'
      }}
    >

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Filter Jobs</h3>
          <button
            onClick={clearFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Job Title</label>
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="e.g., Fullstack Developer"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: '极lock', marginBottom: '6px', fontWeight: '500' }}>Company</label>
            <input
              type="text"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              placeholder="Company name"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., Chennai"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Work Mode</label>
            <select
              name="workMode"
              value={filters.workMode}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option value="">All work modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Min Salary (₹)</label>
            <input
              type="number"
              name="minSalary"
              value={filters.minSalary}
              onChange={handleFilterChange}
              placeholder="e.g., 500000"
              min="0"
              style={{
                width: '极00%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1极 solid #d1d5db',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        marginBottom: '24px', 
        padding: '16px', 
        backgroundColor: 'white', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
        </h3>
        {filteredJobs.length === 0 && allJobs.length > 0 && (
          <p style={{ color: '#666', margin: '8px 0 0 0' }}>
            No jobs match your current filters. Try adjusting your search criteria.
          </p>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
      }}>
        {filteredJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            showActions={showActions}
            onApply={() => handleApply(job)}
            onDelete={handleDelete}
            isApplied={appliedJobs.has(job.id)}
          />
        ))}
      </div>

      {allJobs.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#666', marginBottom: '16px' }}>No jobs available</h3>
          <p style={{ color: '#888' }}>
            Check back later for new job opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobListings;
import React from "react";
import { useState } from "react";

const Home = ({ handleLoginClick }) => {
  
  const styles = {
    homeContainer: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#1a202c",
      lineHeight: 1.6,
      background: "#ffffff",
    },
    hero: {
      background: `
        linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(96, 165, 250, 0.75) 100%),
        url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: "white",
      padding: "120px 0 80px",
      position: "relative",
      overflow: "hidden",
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
    },
    heroContent: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      gap: "60px",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 40px",
      position: "relative",
      zIndex: 2,
    },
    heroText: {
      maxWidth: "550px",
    },
    heroBadge: {
      background: "rgba(255, 255, 255, 0.15)",
      color: "white",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: 600,
      display: "inline-block",
      marginBottom: "24px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    heroTitle: {
      fontSize: "3.25rem",
      fontWeight: 700,
      marginBottom: "20px",
      lineHeight: 1.1,
      color: "white",
    },
    heroSubtitle: {
      fontSize: "1.125rem",
      marginBottom: "32px",
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    heroButtons: {
      display: "flex",
      gap: "16px",
      marginBottom: "40px",
      flexWrap: "wrap",
    },
    primaryButton: {
      background: "white",
      color: "#1e40af",
      padding: "14px 32px",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    primaryButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
    secondaryButton: {
      background: "transparent",
      color: "white",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      padding: "14px 32px",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    secondaryButtonHover: {
      background: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      transform: "translateY(-2px)",
    },
    heroStats: {
      display: "flex",
      gap: "32px",
      paddingTop: "32px",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    },
    statItem: {
      display: "flex",
      flexDirection: "column",
    },
    statNumber: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "white",
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "0.875rem",
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: 500,
    },
    heroVisual: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    visualContainer: {
      position: "relative",
      width: "100%",
      maxWidth: "500px",
    },
    professionalImage: {
      width: "100%",
      height: "400px",
      borderRadius: "20px",
      objectFit: "cover",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      border: "3px solid rgba(255, 255, 255, 0.2)",
    },
    imageFallback: {
      width: "100%",
      height: "400px",
      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    },
    features: {
      padding: "100px 0",
      background: `
        linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%),
        url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 40px",
    },
    sectionHeader: {
      textAlign: "center",
      marginBottom: "60px",
    },
    sectionTitle: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1a202c",
      marginBottom: "16px",
    },
    sectionSubtitle: {
      fontSize: "1.125rem",
      color: "#64748b",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: 1.6,
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "32px",
    },
    featureCard: {
      background: "rgba(255, 255, 255, 0.95)",
      padding: "40px 32px",
      borderRadius: "16px",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e2e8f0",
      backdropFilter: "blur(10px)",
    },
    featureCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 16px 32px rgba(59, 130, 246, 0.15)",
      borderColor: "#3b82f6",
    },
    featureIcon: {
      width: "70px",
      height: "70px",
      margin: "0 auto 24px",
      background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "1.75rem",
    },
    featureTitle: {
      fontSize: "1.375rem",
      fontWeight: 600,
      marginBottom: "16px",
      color: "#1a202c",
    },
    featureDescription: {
      color: "#64748b",
      lineHeight: 1.6,
    },
    categories: {
      padding: "100px 0",
      background: `
        linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%),
        url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    categoriesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
    },
    categoryCard: {
      background: "rgba(255, 255, 255, 0.95)",
      padding: "32px 24px",
      borderRadius: "12px",
      textAlign: "center",
      transition: "all 0.3s ease",
      border: "1px solid #e2e8f0",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
    },
    categoryCardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
    },
    categoryIcon: {
      width: "60px",
      height: "60px",
      margin: "0 auto 20px",
      background: "#eff6ff",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3b82f6",
      fontSize: "1.5rem",
      transition: "all 0.3s ease",
    },
    categoryIconHover: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
      color: "white",
    },
    categoryTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "8px",
      color: "#1a202c",
    },
    categoryJobs: {
      color: "#64748b",
      fontSize: "0.875rem",
    },
    ctaSection: {
      padding: "100px 0",
      background: `
        linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.85) 100%),
        url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: "white",
      textAlign: "center",
    },
    ctaContent: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    ctaTitle: {
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "16px",
      color: "white",
    },
    ctaDescription: {
      fontSize: "1.125rem",
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: "32px",
      lineHeight: 1.6,
    },
    ctaButton: {
      background: "white",
      color: "#1e40af",
      padding: "16px 40px",
      borderRadius: "10px",
      fontSize: "1.1rem",
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    ctaButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
    keyframes: `
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
    `,
  };

  const [hoverStates, setHoverStates] = useState({
    primaryButton: false,
    secondaryButton: false,
    featureCards: Array(3).fill(false),
    categoryCards: Array(6).fill(false),
    ctaButton: false,
  });

  const setHoverState = (key, value) => {
    setHoverStates(prev => ({ ...prev, [key]: value }));
  };

  const categoriesData = [
    { icon: "fas fa-code", title: "Software Development", jobs: "15.2K jobs" },
    { icon: "fas fa-chart-bar", title: "Data & Analytics", jobs: "8.7K jobs" },
    { icon: "fas fa-palette", title: "Design & Creative", jobs: "6.3K jobs" },
    { icon: "fas fa-bullhorn", title: "Marketing", jobs: "9.8K jobs" },
    { icon: "fas fa-shield-alt", title: "Cybersecurity", jobs: "5.4K jobs" },
    { icon: "fas fa-cloud", title: "Cloud & DevOps", jobs: "7.1K jobs" }
  ];

  return (
    <div style={styles.homeContainer}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <style>{styles.keyframes}</style>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <div style={styles.heroBadge}>
              <i className="fas fa-star" style={{ marginRight: "8px" }}></i>
              Trusted by 25,000+ Companies
            </div>
            <h1 style={styles.heroTitle}>
              Find Your Next
              <span style={{ display: 'block', color: '#fbbf24' }}>Career Move</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Connect with top employers and discover opportunities that match your skills and ambitions. 
              Start your journey to career success today.
            </p>
            
            <div style={styles.heroButtons}>
              <button
                style={{
                  ...styles.primaryButton,
                  ...(hoverStates.primaryButton && styles.primaryButtonHover)
                }}
                onMouseEnter={() => setHoverState("primaryButton", true)}
                onMouseLeave={() => setHoverState("primaryButton", false)}
                onClick={() => handleLoginClick("jobseeker")}
              >
                <i className="fas fa-search"></i>
                Find Jobs
              </button>
              <button
                style={{
                  ...styles.secondaryButton,
                  ...(hoverStates.secondaryButton && styles.secondaryButtonHover)
                }}
                onMouseEnter={() => setHoverState("secondaryButton", true)}
                onMouseLeave={() => setHoverState("secondaryButton", false)}
                onClick={() => handleLoginClick("employer")}
              >
                <i className="fas fa-briefcase"></i>
                Post a Job
              </button>
            </div>

            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>50K+</div>
                <div style={styles.statLabel}>Active Jobs</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>15K+</div>
                <div style={styles.statLabel}>Companies</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>85%</div>
                <div style={styles.statLabel}>Success Rate</div>
              </div>
            </div>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.visualContainer}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Professional Team Collaboration"
                style={styles.professionalImage}
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div style={{...styles.imageFallback, display: 'none'}}>
                <i className="fas fa-users" style={{fontSize: "3rem", marginBottom: "1rem"}}></i>
                <h3>Professional Network</h3>
                <p>Connect with top talent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose CareerPro?</h2>
            <p style={styles.sectionSubtitle}>
              We provide the tools and connections you need to advance your career
            </p>
          </div>
          <div style={styles.featuresGrid}>
            {[
              {
                icon: "fas fa-bolt",
                title: "Quick Apply",
                description: "Apply to multiple jobs with one click using your optimized profile"
              },
              {
                icon: "fas fa-shield-check",
                title: "Verified Companies",
                description: "All employers are thoroughly vetted to ensure quality opportunities"
              },
              {
                icon: "fas fa-chart-line",
                title: "Career Growth",
                description: "Access resources and insights to help you grow professionally"
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  ...(hoverStates.featureCards[index] && styles.featureCardHover)
                }}
                onMouseEnter={() => {
                  const newStates = [...hoverStates.featureCards];
                  newStates[index] = true;
                  setHoverState("featureCards", newStates);
                }}
                onMouseLeave={() => {
                  const newStates = [...hoverStates.featureCards];
                  newStates[index] = false;
                  setHoverState("featureCards", newStates);
                }}
              >
                <div style={styles.featureIcon}>
                  <i className={feature.icon}></i>
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categories}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Browse by Category</h2>
            <p style={styles.sectionSubtitle}>
              Explore opportunities in your field of expertise
            </p>
          </div>
          <div style={styles.categoriesGrid}>
            {categoriesData.map((category, index) => (
              <div
                key={index}
                style={{
                  ...styles.categoryCard,
                  ...(hoverStates.categoryCards[index] && styles.categoryCardHover)
                }}
                onMouseEnter={() => {
                  const newStates = [...hoverStates.categoryCards];
                  newStates[index] = true;
                  setHoverState("categoryCards", newStates);
                }}
                onMouseLeave={() => {
                  const newStates = [...hoverStates.categoryCards];
                  newStates[index] = false;
                  setHoverState("categoryCards", newStates);
                }}
              >
                <div
                  style={{
                    ...styles.categoryIcon,
                    ...(hoverStates.categoryCards[index] && styles.categoryIconHover)
                  }}
                >
                  <i className={category.icon}></i>
                </div>
                <h3 style={styles.categoryTitle}>{category.title}</h3>
                <div style={styles.categoryJobs}>{category.jobs}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p style={styles.ctaDescription}>
              Join thousands of professionals who have found their dream jobs through our platform. 
              Create your profile today and take the next step in your career.
            </p>
            <button
              style={{
                ...styles.ctaButton,
                ...(hoverStates.ctaButton && styles.ctaButtonHover)
              }}
              onMouseEnter={() => setHoverState("ctaButton", true)}
              onMouseLeave={() => setHoverState("ctaButton", false)}
              onClick={() => handleLoginClick("jobseeker")}
            >
              <i className="fas fa-user-plus"></i>
              Create Your Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
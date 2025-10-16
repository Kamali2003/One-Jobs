import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is One Jobs?",
      answer: "One Jobs is a dedicated job portal for entry-level and iterative job clusters, currently available in Tamil Nadu."
    },
    {
      question: "Is there any fee for creating a profile or applying to jobs?",
      answer: "No, One Jobs is completely free for job seekers. Creating a profile and applying to jobs is 100% free of charge."
    },
    {
      question: "How do I apply for jobs on One Jobs?",
      answer: "Browse available jobs, click on any job posting to view details, and click the 'Apply Now' button to submit your application. Make sure your profile is complete before applying."
    },
    {
      question: "In which locations are jobs available on One Jobs?",
      answer: "Currently, we focus on opportunities within Tamil Nadu, including major cities like Chennai, Coimbatore, Madurai, Trichy, and Salem, with plans to expand to other regions soon."
    },
    {
      question: "What types of jobs are available on One Jobs?",
      answer: "We specialize in entry-level positions, internships, and iterative job clusters across various industries including IT, manufacturing, healthcare, retail, and hospitality."
    },
  ];

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '60px 20px',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      marginTop: '50px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Main Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '12px',
            background: 'linear-gradient(90deg, #4f46e5, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Find answers to common questions about One Jobs and how to make the most of our platform.
          </p>
        </div>
        
        {/* FAQ Items */}
        <div style={{ marginBottom: '40px' }}>
          {faqData.map((faq, index) => (
            <div key={index} style={{ 
              marginBottom: '16px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <div 
                style={{
                  padding: '20px 24px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  borderLeft: `4px solid ${openIndex === index ? '#4f46e5' : '#e2e8f0'}`,
                }}
                onClick={() => toggleFAQ(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0',
                  paddingRight: '20px'
                }}>
                  {faq.question}
                </h3>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  transform: openIndex === index ? 'rotate(180deg)' : 'none'
                }}>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke={openIndex === index ? '#4f46e5' : '#64748b'} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              
              <div style={{
                maxHeight: openIndex === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease, padding 0.3s ease',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{
                  padding: openIndex === index ? '20px 24px 24px' : '0 24px',
                  borderLeft: '4px solid #4f46e5'
                }}>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#475569',
                    margin: '0'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div style={{
          margin: '40px 0',
          padding: '24px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            zIndex: 0
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                flexShrink: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#92400e',
                margin: '0'
              }}>
                Important Notice
              </h4>
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#92400e',
              margin: '0',
              paddingLeft: '36px'
            }}>
              One Jobs does not charge any money for applying to jobs. 
              If anyone asks for money on our platform, please contact us immediately with details and proofs.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div style={{
          margin: '40px 0',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '20px'
          }}>
            Stay Connected With Us
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {[
              { name: 'Facebook', color: '#1877F2', icon: '👍' },
              { name: 'Twitter', color: '#1DA1F2', icon: '🐦' },
              { name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
              { name: 'Instagram', color: '#E4405F', icon: '📸' }
            ].map((platform, index) => (
              <a
                key={index}
                href="#"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '12px 20px',
                  backgroundColor: platform.color,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span style={{ fontSize: '16px' }}>{platform.icon}</span>
                {platform.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            {['Legal', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'].map((item, index) => (
              <a
                key={index}
                href="#"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.3s ease',
                  position: 'relative',
                  padding: '4px 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                {item}
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '0',
                  height: '2px',
                  backgroundColor: '#4f46e5',
                  transition: 'width 0.3s ease'
                }}></span>
              </a>
            ))}
          </div>
          
          {/* Company Info */}
          <div style={{
            marginTop: '30px'
          }}>
            <p style={{
              fontWeight: '700',
              color: '#4f46e5',
              margin: '0 0 12px 0',
              fontSize: '18px'
            }}>
              One Jobs
            </p>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              No:158, First Floor, Shree Palaniandavar Complex, ByPass Road, RSP Nagar, Dharapuram, Tamil Nadu 638656, India
            </p>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              margin: '16px 0 0 0'
            }}>
              Email: <a href="mailto:info@onejobs.com" style={{
                color: '#4f46e5', 
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                info@onejobs.com
              </a>
            </p>
          </div>
          
          {/* Copyright */}
          <p style={{
            color: '#94a3b8',
            fontSize: '14px',
            marginTop: '30px'
          }}>
            © {new Date().getFullYear()} One Jobs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
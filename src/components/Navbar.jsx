import React from "react";

const Navbar = ({
  isLoggedIn,
  userType,
  handleLoginClick,
  handleLogout,
  currentUser,
  profileComplete,
  setActiveTab,
}) => {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <div
          className="nav-brand"
          onClick={() => setActiveTab("home")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo">
            <i className="fas fa-briefcase"></i>
            <span>One Jobs</span>
          </div>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-profile">
              <div className="user-info">
                <div className="user-avatar" aria-label="User Avatar">
                  <i className="fas fa-user"></i>
                </div>
                <span className="user-name">
                  {currentUser?.name ||
                    (userType === "employer" ? "Employer" : "Job Seeker")}
                </span>
                {userType === "jobseeker" && !profileComplete && (
                  <span className="profile-status">Profile Incomplete</span>
                )}
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                type="button"
                className="btn-signin"
                onClick={() => handleLoginClick("jobseeker")}
              >
                <i className="fas fa-user"></i>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn-employer"
                onClick={() => handleLoginClick("employer")}
              >
                <i className="fas fa-building"></i>
                <span>Employer Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

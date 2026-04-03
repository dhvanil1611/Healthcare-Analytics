import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ showProfileMenu = true }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
    setShowDropdown(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

        .header-logo {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          transition: all 0.3s ease;
        }

        .header-logo:hover {
          transform: scale(1.05);
        }

        .nav-link {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 15px;
          position: relative;
          transition: all 0.3s ease;
          color: #374151;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #0891b2);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: #2563eb;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .login-btn {
           font-family: 'Inter', sans-serif;
           font-weight: 600;
           position: relative;
           overflow: hidden;
           background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
           color: #000 !important;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .login-btn:hover::before {
          left: 100%;
        }

        header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          transition: all 0.3s ease;
        }

        header:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .profile-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          border: 2px solid transparent;
        }

        .profile-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(37, 99, 235, 0.1);
          min-width: 220px;
          margin-top: 8px;
          z-index: 1000;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        }

        .dropdown-header .user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .dropdown-header .user-email {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background-color: rgba(37, 99, 235, 0.05);
          color: #2563eb;
        }

        .dropdown-item.logout {
          border-top: 1px solid rgba(37, 99, 235, 0.1);
          color: #dc2626;
        }

        .dropdown-item.logout:hover {
          background-color: rgba(220, 38, 38, 0.05);
          color: #b91c1c;
        }

        .dropdown-item-icon {
          font-size: 16px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          margin-right: 4px;
        }
      `}</style>

      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <span className="mr-2 text-3xl">⚕️</span>
              <Link to="/" className="header-logo">
                HealthCare Analytics
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/awareness" className="nav-link">
                Awareness
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>

              {user && showProfileMenu ? (
                // Profile dropdown when logged in
                <div className="relative">
                  <button
                    className="profile-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                    title={user.name || 'Profile'}
                  >
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </button>

                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="user-name">{user.name || 'User'}</div>
                        <div className="user-email">{user.email || 'user@example.com'}</div>
                        <div style={{ marginTop: '6px', fontSize: '12px', color: '#10b981' }}>
                          <span className="status-dot"></span>Online
                        </div>
                      </div>

                      <div
                        className="dropdown-item"
                        onClick={handleProfileClick}
                      >
                        <span className="dropdown-item-icon">👤</span>
                        My Profile
                      </div>

                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="dropdown-item-icon">📊</span>
                        Dashboard
                      </Link>

                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/prediction-result');
                          setShowDropdown(false);
                        }}
                      >
                        <span className="dropdown-item-icon">📋</span>
                        Previous Results
                      </div>

                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/analytics');
                          setShowDropdown(false);
                        }}
                      >
                        <span className="dropdown-item-icon">📈</span>
                        Health Analytics
                      </div>

                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/dashboard');
                          setShowDropdown(false);
                        }}
                      >
                        <span className="dropdown-item-icon">⚙️</span>
                        Settings
                      </div>

                      <div
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        <span className="dropdown-item-icon">🚪</span>
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Login button when not logged in
                <Link
                  to="/login"
                  className="login-btn px-6 py-2.5 rounded-lg hover:rounded-lg transition text-black"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

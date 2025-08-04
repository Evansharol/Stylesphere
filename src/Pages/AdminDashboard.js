import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaBars, FaHome, FaBox, FaUsers, FaUserTie, FaCog, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import UserProfile from '../Components/UserProfile';
import DashboardCards from '../Components/DashboardCards';
import DashboardCharts from '../Components/DashboardCharts';
import Products from './Products';
import Orders from './Orders';
import Customers from './Customers';
import Staff from './Staff';
import Settings from './Settings';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState({ name: 'Admin' });
  const navigate = useNavigate();
  
  const handleThemeToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile(isMobileScreen);
      
      // Auto-collapse sidebar on mobile
      if (isMobileScreen) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      } else {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Close mobile sidebar when clicking outside
  const handleBackdropClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Handle logout function
  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    
    // Navigate back to login page
    navigate('/');
  };

  // Load current logged-in user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    console.log('Retrieved userData from localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user data:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    } else {
      // Fallback: check if there's a registered user and use that
      const registeredUser = localStorage.getItem('user');
      if (registeredUser) {
        try {
          const user = JSON.parse(registeredUser);
          console.log('Using fallback registered user:', user);
          const fallbackUser = { name: user.name, email: user.email };
          console.log('Setting currentUser to:', fallbackUser);
          setCurrentUser(fallbackUser);
          // Store it for future sessions
          localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        } catch (error) {
          console.error('Error with fallback user data:', error);
        }
      } else {
        console.log('No user data found in localStorage');
      }
    }
  }, []);

  // Debug: Track currentUser state changes
  useEffect(() => {
    console.log('CurrentUser state updated to:', currentUser);
  }, [currentUser]);

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', active: activeMenu === 'Dashboard' },
    { icon: FaBox, label: 'Products', active: activeMenu === 'Products' },
    { icon: FaChartLine, label: 'Orders', active: activeMenu === 'Orders' },
    { icon: FaUsers, label: 'Customer', active: activeMenu === 'Customer' },
    { icon: FaUserTie, label: 'Staff', active: activeMenu === 'Staff' },
    { icon: FaCog, label: 'Setting', active: activeMenu === 'Setting' }
  ];

  const handleMenuClick = (menuLabel) => {
    setActiveMenu(menuLabel);
    // Auto-close mobile sidebar after menu selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleCardClick = (route) => {
    setActiveMenu(route);
  };

  const renderContent = () => {
    switch(activeMenu) {
      case 'Products':
        return <Products theme={theme} />;
      case 'Orders':
        return <Orders theme={theme} />;
      case 'Customer':
        return <Customers theme={theme} />;
      case 'Staff':
        return <Staff theme={theme} />;
      case 'Setting':
        return <Settings theme={theme} />;
      default:
        return (
          <div className="dashboard-content">
            <h1>Dashboard</h1>
            <DashboardCards theme={theme} onCardClick={handleCardClick} />
            <DashboardCharts theme={theme} />
          </div>
        );
    }
  };

  return (
    <div className={`admin-dashboard-container${theme === 'dark' ? ' dark-theme' : ''}`}>
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={handleBackdropClick}></div>
      )}
      
      {/* Header */}
      <header className="admin-dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={handleSidebarToggle}
          >
            <FaBars />
          </button>
          <div className="header-logo">
            <span className="logo-text">Stylesphere</span>
          </div>
        </div>
        <div className="header-right">
          <button onClick={handleThemeToggle} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="notification-btn" aria-label="Notifications">
            <FaBell />
            <span className="notification-badge">0</span>
          </button>
          <UserProfile user={currentUser} />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarCollapsed ? ' collapsed' : ''}${isMobile && sidebarOpen ? ' mobile-open' : ''}${isMobile && !sidebarOpen ? ' mobile-hidden' : ''}`}>
        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => (
            <div 
              key={index} 
              className={`sidebar-item${item.active ? ' active' : ''}`}
              onClick={() => handleMenuClick(item.label)}
            >
              <item.icon className="sidebar-icon" />
              {(!sidebarCollapsed || (isMobile && sidebarOpen)) && <span className="sidebar-label">{item.label}</span>}
            </div>
          ))}
          
          {/* Logout Button */}
          <div 
            className="sidebar-item logout-item"
            onClick={handleLogout}
            style={{ 
              marginTop: 'auto',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '10px'
            }}
          >
            <FaSignOutAlt className="sidebar-icon" />
            {(!sidebarCollapsed || (isMobile && sidebarOpen)) && <span className="sidebar-label">Logout</span>}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
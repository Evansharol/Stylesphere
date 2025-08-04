import React, { useState, useEffect } from 'react';
import { 
  FaSave, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEdit, 
  FaCamera,
  FaEnvelope,
  FaBriefcase,
  FaCalendarAlt,
  FaUserTie,
  FaIdCard,
  FaClock,
  FaUserCheck,
  FaShieldAlt,
  FaKey,
  FaBell,
  FaEye,
  FaPalette,
  FaLanguage
} from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = ({ theme }) => {
  // Get logged-in user data from localStorage
  const getLoggedInUser = () => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const { name, email } = JSON.parse(userData);
      return { name: name || 'Admin', email: email || 'admin@stylesphere.com' };
    }
    return { name: 'Admin', email: 'admin@stylesphere.com' };
  };

  const loggedInUser = getLoggedInUser();

  const [adminData, setAdminData] = useState({
    // Personal Information (using actual logged-in user data)
    name: loggedInUser.name,
    email: loggedInUser.email,
    username: loggedInUser.email.split('@')[0], // Generate username from email
    employeeId: 'EMP-2025-001',
    bio: 'Experienced administrator with expertise in system management and user operations.',
    
    // Contact Information
    phone: '',
    alternatePhone: '',
    address: '',
    
    // Professional Information
    department: 'Administration',
    position: 'System Administrator',
    role: 'Super Admin',
    joiningDate: '2025-01-01', // Default joining date
    reportingManager: '',
    
    // Personal Details
    dateOfBirth: '',
    nationality: '',
    language: 'English',
    timeZone: 'Eastern Time (ET)',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    
    // System Information
    lastLogin: new Date().toISOString(),
    accountCreated: '2025-01-01',
    profileCompleteness: 40, // Lower since we have less default data
    
    profilePicture: '' // Start with empty to show initials by default
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  // Load admin data (merge logged-in user with saved settings)
  useEffect(() => {
    // Get saved settings from localStorage
    const savedData = localStorage.getItem('adminSettings');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Merge saved data with logged-in user data, but keep email and name from login
      setAdminData(prev => ({ 
        ...prev, 
        ...parsedData,
        // Always use logged-in user's credentials
        name: loggedInUser.name,
        email: loggedInUser.email,
        username: loggedInUser.email.split('@')[0]
      }));
    }
  }, [loggedInUser.name, loggedInUser.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
      }
      
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!adminData.name.trim()) {
        showNotification('Name is required', 'error');
        return;
      }

      // Note: Email is read-only and doesn't need validation

      // Phone validation
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (adminData.phone && !phoneRegex.test(adminData.phone.replace(/[\s\-()]/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return;
      }

      // If new image is selected, update profile picture
      if (selectedImage) {
        // In a real app, you would upload the image to a server
        // For now, we'll use the preview URL
        setAdminData(prev => ({
          ...prev,
          profilePicture: imagePreview
        }));
      }

      // Calculate profile completeness
      const requiredFields = ['name', 'phone', 'address', 'bio', 'position'];
      const completedFields = requiredFields.filter(field => adminData[field] && adminData[field].trim() !== '').length;
      const completeness = Math.round((completedFields / requiredFields.length) * 100);

      // Save to localStorage (in real app, this would be an API call)
      const dataToSave = selectedImage 
        ? { ...adminData, profilePicture: imagePreview, profileCompleteness: completeness }
        : { ...adminData, profileCompleteness: completeness };
      
      // Ensure we always preserve the logged-in user's email and name
      dataToSave.email = loggedInUser.email;
      dataToSave.name = loggedInUser.name;
      dataToSave.username = loggedInUser.email.split('@')[0];
      
      localStorage.setItem('adminSettings', JSON.stringify(dataToSave));
      setAdminData(prev => ({ 
        ...prev, 
        profileCompleteness: completeness,
        ...(selectedImage && { profilePicture: imagePreview }),
        // Ensure logged-in user data is preserved
        email: loggedInUser.email,
        name: loggedInUser.name,
        username: loggedInUser.email.split('@')[0]
      }));

      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview('');
      showNotification('Profile updated successfully!', 'success');

    } catch (error) {
      showNotification('Failed to save settings. Please try again.', 'error');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload from localStorage but preserve logged-in user data
    const savedData = localStorage.getItem('adminSettings');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAdminData(prev => ({
        ...parsedData,
        // Always preserve logged-in user credentials
        name: loggedInUser.name,
        email: loggedInUser.email,
        username: loggedInUser.email.split('@')[0]
      }));
    } else {
      // Reset to initial state with logged-in user data
      setAdminData(prev => ({
        ...prev,
        name: loggedInUser.name,
        email: loggedInUser.email,
        username: loggedInUser.email.split('@')[0]
      }));
    }
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview('');
  };

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  const departmentOptions = [
    'Administration', 'Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'
  ];

  const timeZoneOptions = [
    'Eastern Time (ET)', 'Central Time (CT)', 'Mountain Time (MT)', 
    'Pacific Time (PT)', 'UTC', 'GMT'
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileCompleteness = () => {
    const requiredFields = ['name', 'phone', 'address', 'bio', 'position'];
    const completedFields = requiredFields.filter(field => adminData[field] && adminData[field].trim() !== '').length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  return (
    <div className={`settings-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type} show`}>
          <div className="notification-content">
            <span>{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="settings-container">
        {/* Header with Profile Summary */}
        <div className="settings-header-card">
          <div className="profile-summary">
            <div className="profile-avatar-section">
              <div className="profile-picture-container">
                {(imagePreview || adminData.profilePicture) ? (
                  <img 
                    src={imagePreview || adminData.profilePicture} 
                    alt="Profile" 
                    className="profile-picture"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="profile-picture-fallback"
                  style={{ 
                    display: (imagePreview || adminData.profilePicture) ? 'none' : 'flex',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'uppercase'
                  }}
                >
                  {adminData.name.charAt(0)}
                </div>
                {isEditing && (
                  <div className="picture-overlay">
                    <label htmlFor="profilePicture" className="change-picture-btn">
                      <FaCamera />
                      <span>Change</span>
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="profile-status">
                <span className="status-indicator active"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
            
            <div className="profile-info">
              <h1>{adminData.name}</h1>
              <p className="role-title">{adminData.position} • {adminData.role}</p>
              <p className="department">{adminData.department}</p>
              <p className="logged-in-email"><FaEnvelope /> {adminData.email}</p>
              <div className="profile-meta">
                <span><FaCalendarAlt /> Joined {formatDate(adminData.joiningDate)}</span>
                <span><FaClock /> Last login: {new Date(adminData.lastLogin).toLocaleString()}</span>
                <span><FaIdCard /> Employee ID: {adminData.employeeId}</span>
              </div>
            </div>

            <div className="profile-actions">
              <div className="profile-completeness">
                <div className="completeness-circle">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray={`${getProfileCompleteness() * 1.57} 157`}
                      strokeLinecap="round"
                      transform="rotate(-90 30 30)"
                    />
                    <text x="30" y="35" textAnchor="middle" className="completeness-text">
                      {getProfileCompleteness()}%
                    </text>
                  </svg>
                </div>
                <span className="completeness-label">Profile Complete</span>
              </div>
              
              {!isEditing && (
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser /> Personal Information
          </button>
          <button 
            className={`tab-button ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            <FaBriefcase /> Professional Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt /> Security & Privacy
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaPalette /> Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="settings-section">
              <div className="section-header">
                <h2><FaUser /> Personal Information</h2>
              </div>
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={adminData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={adminData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"><FaEnvelope /> Email Address (Account Email)</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={adminData.email}
                      disabled={true}
                      className="readonly-field"
                      placeholder="Logged-in user's email address"
                      title="This is your account email and cannot be changed"
                    />
                    <small className="field-note">This is your account email and cannot be modified</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone"><FaPhone /> Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={adminData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="alternatePhone">Alternate Phone</label>
                    <input
                      id="alternatePhone"
                      type="tel"
                      name="alternatePhone"
                      value={adminData.alternatePhone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter alternate phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={adminData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                      id="nationality"
                      type="text"
                      name="nationality"
                      value={adminData.nationality}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your nationality"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="language"><FaLanguage /> Preferred Language</label>
                    <select
                      id="language"
                      name="language"
                      value={adminData.language}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      {languageOptions.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={adminData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your complete address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="bio">Bio / About Me</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={adminData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself, your experience, and interests..."
                      rows="4"
                    />
                  </div>
                </div>

                <div className="section-divider">
                  <h3>Emergency Contact</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="emergencyContactName">Contact Name</label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      name="emergencyContactName"
                      value={adminData.emergencyContactName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyContactRelation">Relationship</label>
                    <input
                      id="emergencyContactRelation"
                      type="text"
                      name="emergencyContactRelation"
                      value={adminData.emergencyContactRelation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyContactPhone">Contact Phone</label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      name="emergencyContactPhone"
                      value={adminData.emergencyContactPhone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="settings-section">
              <div className="section-header">
                <h2><FaBriefcase /> Professional Details</h2>
              </div>
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <input
                      id="employeeId"
                      type="text"
                      name="employeeId"
                      value={adminData.employeeId}
                      disabled
                      className="readonly-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="position">Position / Title</label>
                    <input
                      id="position"
                      type="text"
                      name="position"
                      value={adminData.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Your job title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      name="department"
                      value={adminData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">System Role</label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={adminData.role}
                      disabled
                      className="readonly-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reportingManager">Reporting Manager</label>
                    <input
                      id="reportingManager"
                      type="text"
                      name="reportingManager"
                      value={adminData.reportingManager}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Direct supervisor name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="joiningDate">Joining Date</label>
                    <input
                      id="joiningDate"
                      type="date"
                      name="joiningDate"
                      value={adminData.joiningDate}
                      disabled
                      className="readonly-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeZone">Time Zone</label>
                    <select
                      id="timeZone"
                      name="timeZone"
                      value={adminData.timeZone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      {timeZoneOptions.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2><FaShieldAlt /> Security & Privacy</h2>
              </div>
              <div className="security-options">
                <div className="security-item">
                  <div className="security-icon">
                    <FaKey />
                  </div>
                  <div className="security-info">
                    <h3>Change Password</h3>
                    <p>Update your account password for better security</p>
                  </div>
                  <button className="secondary-btn">Change Password</button>
                </div>

                <div className="security-item">
                  <div className="security-icon">
                    <FaUserCheck />
                  </div>
                  <div className="security-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="secondary-btn enabled">Enabled</button>
                </div>

                <div className="security-item">
                  <div className="security-icon">
                    <FaEye />
                  </div>
                  <div className="security-info">
                    <h3>Login Activity</h3>
                    <p>Review recent login attempts and active sessions</p>
                  </div>
                  <button className="secondary-btn">View Activity</button>
                </div>

                <div className="security-item">
                  <div className="security-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="security-info">
                    <h3>Privacy Settings</h3>
                    <p>Control your data sharing and privacy preferences</p>
                  </div>
                  <button className="secondary-btn">Manage Privacy</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <div className="section-header">
                <h2><FaPalette /> Preferences</h2>
              </div>
              <div className="preferences-options">
                <div className="preference-item">
                  <div className="preference-icon">
                    <FaBell />
                  </div>
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email notifications for important updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-icon">
                    <FaEnvelope />
                  </div>
                  <div className="preference-info">
                    <h3>Marketing Emails</h3>
                    <p>Receive promotional emails and newsletters</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-icon">
                    <FaUserTie />
                  </div>
                  <div className="preference-info">
                    <h3>Profile Visibility</h3>
                    <p>Allow other team members to view your profile</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-icon">
                    <FaClock />
                  </div>
                  <div className="preference-info">
                    <h3>Activity Status</h3>
                    <p>Show when you're online to other users</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="form-actions-fixed">
            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <FaSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

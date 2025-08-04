import React from 'react';

const UserProfile = ({ user }) => {
  // Debug: Log what user data is received
  console.log('UserProfile component received user:', user);
  console.log('User name:', user?.name);
  
  // Also check localStorage directly and use it as fallback
  let displayName = user?.name;
  
  if (!displayName || displayName === 'Admin') {
    const currentUser = localStorage.getItem('currentUser');
    const registeredUser = localStorage.getItem('user');
    
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        displayName = userData.name;
        console.log('Using currentUser from localStorage:', userData.name);
      } catch (e) {
        console.error('Error parsing currentUser:', e);
      }
    } else if (registeredUser) {
      try {
        const userData = JSON.parse(registeredUser);
        displayName = userData.name;
        console.log('Using registered user from localStorage:', userData.name);
      } catch (e) {
        console.error('Error parsing registered user:', e);
      }
    }
  }
  
  console.log('Final display name:', displayName);
  
  return (
    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="user-avatar">
        {/* Placeholder avatar, you can replace with user image */}
        <span role="img" aria-label="User" style={{ fontSize: 24, color: 'white' }}>👤</span>
      </div>
      <div className="user-info">
        <span className="user-name" style={{ color: 'Black', fontWeight: '500', fontSize: '16px' }}>
          {displayName || 'Admin'}
        </span>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../styles/Staff.css';

const Staff = ({ theme }) => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    contact: '',
    role: '',
    joiningDate: ''
  });
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    contact: '',
    role: '',
    joiningDate: ''
  });

  // Sample staff data
  useEffect(() => {
    const sampleStaff = [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@gmail.com',
        contact: '360-943-7332',
        joiningDate: '23 Jul, 2025',
        role: 'Super Admin',
        status: 'Active',
        published: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Marion V. Parker',
        email: 'marion@gmail.com',
        contact: '713-675-8613',
        joiningDate: '23 Jul, 2025',
        role: 'Admin',
        status: 'Inactive',
        published: false,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95eb09d?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 3,
        name: 'Stacey J. Meikle',
        email: 'stacey@gmail.com',
        contact: '616-738-0407',
        joiningDate: '23 Jul, 2025',
        role: 'CEO',
        status: 'Inactive',
        published: false,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 4,
        name: 'Shawn E. Palmer',
        email: 'shawn@gmail.com',
        contact: '949-202-2913',
        joiningDate: '23 Jul, 2025',
        role: 'Manager',
        status: 'Active',
        published: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 5,
        name: 'Corrie H. Cates',
        email: 'corrie@gmail.com',
        contact: '914-623-6873',
        joiningDate: '23 Jul, 2025',
        role: 'Accountant',
        status: 'Active',
        published: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 6,
        name: 'Alice B. Porter',
        email: 'alice@gmail.com',
        contact: '708-488-9728',
        joiningDate: '23 Jul, 2025',
        role: 'Cashier',
        status: 'Active',
        published: true,
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: 7,
        name: 'Dorothy R. Brown',
        email: 'dorothy@gmail.com',
        contact: '708-628-3122',
        joiningDate: '23 Jul, 2025',
        role: 'Security Guard',
        status: 'Active',
        published: true,
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face'
      }
    ];
    setStaff(sampleStaff);
    setFilteredStaff(sampleStaff);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    applyFilters(searchTerm, role);
  };

  const applyFilters = (search, role) => {
    let filtered = [...staff];

    if (search.trim() !== '') {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.contact.includes(search)
      );
    }

    if (role && role !== '') {
      filtered = filtered.filter(member =>
        member.role.toLowerCase() === role.toLowerCase()
      );
    }

    setFilteredStaff(filtered);
  };

  const handleFilter = () => {
    applyFilters(searchTerm, roleFilter);
  };

  const handleReset = () => {
    setSearchTerm('');
    setRoleFilter('');
    setFilteredStaff(staff);
  };

  const handleTogglePublished = (id) => {
    const updatedStaff = staff.map(member => {
      if (member.id === id) {
        return {
          ...member,
          published: !member.published,
          status: !member.published ? 'Active' : 'Inactive'
        };
      }
      return member;
    });
    setStaff(updatedStaff);
    
    // Update filtered staff as well
    const updatedFiltered = filteredStaff.map(member => {
      if (member.id === id) {
        return {
          ...member,
          published: !member.published,
          status: !member.published ? 'Active' : 'Inactive'
        };
      }
      return member;
    });
    setFilteredStaff(updatedFiltered);
  };

  const handleViewStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowViewModal(true);
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setEditFormData({
      name: staffMember.name,
      email: staffMember.email,
      contact: staffMember.contact,
      role: staffMember.role,
      joiningDate: staffMember.joiningDate
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedStaff(null);
    setEditFormData({
      name: '',
      email: '',
      contact: '',
      role: '',
      joiningDate: ''
    });
    setAddFormData({
      name: '',
      email: '',
      contact: '',
      role: '',
      joiningDate: ''
    });
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateStaff = () => {
    if (!addFormData.name.trim() || !addFormData.email.trim()) {
      alert('Name and Email are required fields');
      return;
    }

    // Generate a new ID (find the highest existing ID and add 1)
    const maxId = Math.max(...staff.map(member => member.id), 0);
    const newId = maxId + 1;

    // Generate a random avatar
    const avatarOptions = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b95eb09d?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face'
    ];
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

    const newStaff = {
      id: newId,
      name: addFormData.name,
      email: addFormData.email,
      contact: addFormData.contact,
      joiningDate: addFormData.joiningDate,
      role: addFormData.role,
      status: 'Active',
      published: true,
      avatar: randomAvatar
    };

    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    
    // Update filtered staff based on current filters
    const filtered = updatedStaff.filter(member =>
      (searchTerm === '' || 
       member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.contact.includes(searchTerm)) &&
      (roleFilter === '' || member.role.toLowerCase() === roleFilter.toLowerCase())
    );
    setFilteredStaff(filtered);
    
    handleCloseModal();
    alert('Staff member added successfully!');
  };

  const handleUpdateStaff = () => {
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert('Name and Email are required fields');
      return;
    }

    const updatedStaff = staff.map(member => 
      member.id === selectedStaff.id 
        ? { ...member, ...editFormData }
        : member
    );

    setStaff(updatedStaff);
    
    // Update filtered staff if search is active
    const filtered = updatedStaff.filter(member =>
      (searchTerm === '' || 
       member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.contact.includes(searchTerm)) &&
      (roleFilter === '' || member.role.toLowerCase() === roleFilter.toLowerCase())
    );
    setFilteredStaff(filtered);
    
    handleCloseModal();
    alert('Staff member updated successfully!');
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updatedStaff = staff.filter(member => member.id !== id);
      setStaff(updatedStaff);
      setFilteredStaff(updatedStaff.filter(member =>
        (searchTerm === '' || 
         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.contact.includes(searchTerm)) &&
        (roleFilter === '' || member.role.toLowerCase() === roleFilter.toLowerCase())
      ));
    }
  };

  const handleAddStaff = () => {
    // Set current date as joining date
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setAddFormData({
      name: '',
      email: '',
      contact: '',
      role: '',
      joiningDate: currentDate
    });
    setShowAddModal(true);
  };

  return (
    <div className={`staff-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="staff-container">
        <div className="staff-header">
          <h1 className="staff-page-heading">Staff</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="staff-filters">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by name/email/phone"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="role-filter">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="role-select"
            >
              <option value="">Staff Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="CEO">CEO</option>
              <option value="Manager">Manager</option>
              <option value="Accountant">Accountant</option>
              <option value="Cashier">Cashier</option>
              <option value="Security Guard">Security Guard</option>
            </select>
          </div>

          <div className="action-buttons">
            <button className="add-staff-btn" onClick={handleAddStaff}>
              <FaPlus />
              Add Staff
            </button>
            <button className="filter-btn" onClick={handleFilter}>Filter</button>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="staff-table-container">
          {filteredStaff.length > 0 ? (
            <table className="staff-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>CONTACT</th>
                  <th>JOINING DATE</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>PUBLISHED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id}>
                    <td className="staff-name">
                      <div className="name-cell">
                        <img src={member.avatar} alt={member.name} className="staff-avatar" />
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="staff-email">{member.email}</td>
                    <td className="staff-contact">{member.contact}</td>
                    <td className="joining-date">{member.joiningDate}</td>
                    <td className="staff-role">{member.role}</td>
                    <td className="staff-status">
                      <span className={`status-badge ${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="published-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={member.published}
                          onChange={() => handleTogglePublished(member.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td className="staff-actions">
                      <button 
                        className="action-btn view-btn" 
                        title="View Staff"
                        onClick={() => handleViewStaff(member)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Staff"
                        onClick={() => handleEditStaff(member)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Staff"
                        onClick={() => handleDeleteStaff(member.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-staff-found">
              <div className="no-staff-content">
                <h3>No staff found</h3>
                <p>No staff members match your current search criteria. Try adjusting your search or resetting the filters.</p>
                <button className="reset-search-btn" onClick={handleReset}>
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Update Staff Member</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Staff member name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editFormData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="staff@email.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  value={editFormData.contact}
                  onChange={(e) => handleFormChange('contact', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={editFormData.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="CEO">CEO</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Security Guard">Security Guard</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="joiningDate">Joining Date</label>
                <input
                  type="text"
                  id="joiningDate"
                  value={editFormData.joiningDate}
                  onChange={(e) => handleFormChange('joiningDate', e.target.value)}
                  placeholder="Jul 23, 2025"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="update-btn" onClick={handleUpdateStaff}>
                Update Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className="modal-overlay">
          <div className="view-modal">
            <div className="modal-header">
              <h2>View Staff Member</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="staff-avatar-section">
                <img 
                  src={selectedStaff.avatar} 
                  alt={selectedStaff.name}
                  className="staff-avatar-large"
                />
                <div className="staff-basic-info">
                  <h3>{selectedStaff.name}</h3>
                  <span className={`status-badge ${selectedStaff.status.toLowerCase()}`}>
                    {selectedStaff.status}
                  </span>
                </div>
              </div>

              <div className="view-form-group">
                <label>Staff ID</label>
                <div className="read-only-field">#{selectedStaff.id}</div>
              </div>
              
              <div className="view-form-group">
                <label>Full Name</label>
                <div className="read-only-field">{selectedStaff.name}</div>
              </div>
              
              <div className="view-form-group">
                <label>Email Address</label>
                <div className="read-only-field">{selectedStaff.email}</div>
              </div>
              
              <div className="view-form-group">
                <label>Contact Number</label>
                <div className="read-only-field">{selectedStaff.contact}</div>
              </div>
              
              <div className="view-form-group">
                <label>Role</label>
                <div className="read-only-field role-field">{selectedStaff.role}</div>
              </div>
              
              <div className="view-form-group">
                <label>Joining Date</label>
                <div className="read-only-field">{selectedStaff.joiningDate}</div>
              </div>

              <div className="view-form-group">
                <label>Account Status</label>
                <div className="read-only-field">
                  <span className={`status-indicator ${selectedStaff.status.toLowerCase()}`}>
                    {selectedStaff.status}
                  </span>
                  {selectedStaff.published ? ' • Published' : ' • Unpublished'}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={handleCloseModal}>
                Close
              </button>
              <button 
                className="edit-from-view-btn" 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditStaff(selectedStaff);
                }}
              >
                <FaEdit />
                Edit Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <p>Fill in the information below to add a new staff member to your team.</p>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="add-name">Full Name *</label>
                <input
                  type="text"
                  id="add-name"
                  value={addFormData.name}
                  onChange={(e) => handleAddFormChange('name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="add-email">Email Address *</label>
                <input
                  type="email"
                  id="add-email"
                  value={addFormData.email}
                  onChange={(e) => handleAddFormChange('email', e.target.value)}
                  placeholder="staff@company.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="add-contact">Contact Number</label>
                <input
                  type="text"
                  id="add-contact"
                  value={addFormData.contact}
                  onChange={(e) => handleAddFormChange('contact', e.target.value)}
                  placeholder="+1-XXX-XXX-XXXX"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="add-role">Role *</label>
                <select
                  id="add-role"
                  value={addFormData.role}
                  onChange={(e) => handleAddFormChange('role', e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="CEO">CEO</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Security Guard">Security Guard</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="add-joiningDate">Joining Date</label>
                <input
                  type="text"
                  id="add-joiningDate"
                  value={addFormData.joiningDate}
                  onChange={(e) => handleAddFormChange('joiningDate', e.target.value)}
                  placeholder="Aug 4, 2025"
                />
              </div>

              <div className="form-note">
                <p><strong>Note:</strong> Fields marked with * are required. The new staff member will be automatically set to "Active" status and will be visible in the staff list immediately.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateStaff}>
                <FaPlus />
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;

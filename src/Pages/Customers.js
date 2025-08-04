import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/Customers.css';

const Customers = ({ theme }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Sample customers data
  useEffect(() => {
    const sampleCustomers = [
      {
        id: 'E129',
        joiningDate: 'Jul 23, 2025',
        name: 'Axune Tex',
        email: 'temurbekshukurov0707@gmail.com',
        phone: '+998901234567',
        address: '123 Main St, City'
      },
      {
        id: '1D3C',
        joiningDate: 'Jul 23, 2025',
        name: '3069_Ridhibrata Das',
        email: 'ridhibratadas@gmail.com',
        phone: '+919876543210',
        address: '456 Oak Ave, Town'
      },
      {
        id: 'CA5D',
        joiningDate: 'Jul 23, 2025',
        name: 'Danh Nguyễn',
        email: 'contactbydanh@gmail.com',
        phone: '+84987654321',
        address: '789 Pine Rd, Village'
      },
      {
        id: '2920',
        joiningDate: 'Jul 18, 2025',
        name: 'Vishnu Prasad',
        email: 'vpmoothikkal@gmail.com',
        phone: '+919123456789',
        address: '321 Elm St, District'
      },
      {
        id: '216D',
        joiningDate: 'Jul 18, 2025',
        name: 'ankittny',
        email: 'tny3infotech@gmail.com',
        phone: '+918765432109',
        address: '654 Maple Dr, County'
      },
      {
        id: 'A47B',
        joiningDate: 'Jul 15, 2025',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@gmail.com',
        phone: '+4412345678',
        address: '987 Cedar Ln, Borough'
      },
      {
        id: '8F2E',
        joiningDate: 'Jul 12, 2025',
        name: 'Mike Johnson',
        email: 'mike.johnson@gmail.com',
        phone: '+14155551234',
        address: '147 Birch Way, Suburb'
      },
      {
        id: '5C9A',
        joiningDate: 'Jul 10, 2025',
        name: 'Emma Davis',
        email: 'emma.davis@gmail.com',
        phone: '+61234567890',
        address: '258 Spruce Ct, Region'
      }
    ];
    setCustomers(sampleCustomers);
    setFilteredCustomers(sampleCustomers);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.email.toLowerCase().includes(value.toLowerCase()) ||
        customer.phone.includes(value)
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleFilter = () => {
    // Filter functionality can be enhanced here
    handleSearch(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredCustomers(customers);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || ''
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedCustomer(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateCustomer = () => {
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert('Name and Email are required fields');
      return;
    }

    const updatedCustomers = customers.map(customer => 
      customer.id === selectedCustomer.id 
        ? { ...customer, ...editFormData }
        : customer
    );

    setCustomers(updatedCustomers);
    
    // Update filtered customers if search is active
    const filtered = updatedCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
    
    handleCloseModal();
    alert('Customer updated successfully!');
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      ));
    }
  };

  return (
    <div className={`customers-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="customers-container">
        <div className="customers-header">
          <h1 className="customer-page-heading">Customers</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="customers-filters">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by name/email/phone"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <button className="filter-btn" onClick={handleFilter}>Filter</button>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="customers-table-container">
          {filteredCustomers.length > 0 ? (
            <table className="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>JOINING DATE</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customer-id">{customer.id}</td>
                    <td className="joining-date">{customer.joiningDate}</td>
                    <td className="customer-name">{customer.name}</td>
                    <td className="customer-email">{customer.email}</td>
                    <td className="customer-phone">{customer.phone}</td>
                    <td className="customer-actions">
                      <button 
                        className="action-btn view-btn" 
                        title="View Customer"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Customer"
                        onClick={() => handleEditCustomer(customer)}
                        style={{
                          background: '#3b82f6 !important',
                          color: 'white !important',
                          border: 'none !important',
                          borderRadius: '6px !important',
                          width: '36px !important',
                          height: '36px !important',
                          display: 'flex !important',
                          alignItems: 'center !important',
                          justifyContent: 'center !important',
                          cursor: 'pointer !important',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3) !important'
                        }}
                      >
                        <FaEdit style={{ color: 'white !important', fontSize: '16px !important' }} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Customer"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-customers-found">
              <div className="no-customers-content">
                <h3>No customers found</h3>
                <p>No customers match your current search criteria. Try adjusting your search or resetting the filter.</p>
                <button className="reset-search-btn" onClick={handleReset}>
                  Reset Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Update Customer</h2>
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
                  placeholder="Customer name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editFormData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="customer@email.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="Phone"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  value={editFormData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder="Address"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="update-btn" onClick={handleUpdateCustomer}>
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {showViewModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="view-modal">
            <div className="modal-header">
              <h2>View Customer</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="customer-info-section">
                <div className="customer-avatar">
                  <div className="avatar-placeholder">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="customer-basic-info">
                  <h3>{selectedCustomer.name}</h3>
                  <span className="customer-id">ID: #{selectedCustomer.id}</span>
                </div>
              </div>

              <div className="view-form-group">
                <label>Customer ID</label>
                <div className="read-only-field">#{selectedCustomer.id}</div>
              </div>
              
              <div className="view-form-group">
                <label>Full Name</label>
                <div className="read-only-field">{selectedCustomer.name}</div>
              </div>
              
              <div className="view-form-group">
                <label>Email Address</label>
                <div className="read-only-field">{selectedCustomer.email}</div>
              </div>
              
              <div className="view-form-group">
                <label>Phone Number</label>
                <div className="read-only-field">{selectedCustomer.phone}</div>
              </div>
              
              <div className="view-form-group">
                <label>Address</label>
                <div className="read-only-field address-field">
                  {selectedCustomer.address || 'No address provided'}
                </div>
              </div>

              <div className="view-form-group">
                <label>Joining Date</label>
                <div className="read-only-field">{selectedCustomer.joiningDate}</div>
              </div>

              <div className="view-form-group">
                <label>Customer Status</label>
                <div className="read-only-field">
                  <span className="status-indicator active">
                    Active Customer
                  </span>
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
                  handleEditCustomer(selectedCustomer);
                }}
              >
                <FaEdit />
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

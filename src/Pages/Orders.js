import React, { useState, useEffect } from 'react';
import { FaDownload, FaPrint, FaEye } from 'react-icons/fa';
import '../styles/Orders.css';

const Orders = ({ theme }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    customerName: '',
    status: '',
    orderLimit: '',
    method: '',
    startDate: '',
    endDate: ''
  });

  // Sample orders data
  useEffect(() => {
    const sampleOrders = [
      {
        id: '12116',
        orderTime: '24 Jul, 2025 1:29 PM',
        customerName: 'John Cena',
        customerEmail: 'justin@gmail.com',
        customerPhone: '+9616566565',
        customerAddress: 'New Delhi, India, 110059',
        method: 'Card',
        amount: '$75.56',
        status: 'Cancel',
        statusColor: 'cancel',
        items: [
          { sr: 1, title: 'Earing', quantity: 1, price: '$15.56', amount: '$15.56' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$75.56'
      },
      {
        id: '12146',
        orderTime: '24 Jul, 2025 12:22 PM',
        customerName: 'John Doe',
        customerEmail: 'johndoe@gmail.com',
        customerPhone: '+1234567890',
        customerAddress: 'New York, USA, 10001',
        method: 'Cash',
        amount: '$960.00',
        status: 'Processing',
        statusColor: 'processing',
        items: [
          { sr: 1, title: 'Jeans', quantity: 2, price: '$450.00', amount: '$900.00' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$960.00'
      },
      {
        id: '12145',
        orderTime: '23 Jul, 2025 2:53 PM',
        customerName: 'Prince Sins',
        customerEmail: 'prince.sins@gmail.com',
        customerPhone: '+4471234567',
        customerAddress: 'London, UK, SW1A 1AA',
        method: 'Cash',
        amount: '$253.26',
        status: 'Pending',
        statusColor: 'pending',
        items: [
          { sr: 1, title: 'T shirt', quantity: 1, price: '$193.26', amount: '$193.26' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$253.26'
      },
      {
        id: '12141',
        orderTime: '23 Jul, 2025 9:10 AM',
        customerName: 'Brenda Francis',
        customerEmail: 'brenda.francis@gmail.com',
        customerPhone: '+33123456789',
        customerAddress: 'Paris, France, 75001',
        method: 'Cash',
        amount: '$120.00',
        status: 'Pending',
        statusColor: 'pending',
        items: [
          { sr: 1, title: 'Bracelet', quantity: 1, price: '$60.00', amount: '$60.00' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$120.00'
      },
      {
        id: '12142',
        orderTime: '23 Jul, 2025 8:46 AM',
        customerName: 'Kareem Gamal',
        customerEmail: 'kareem.gamal@gmail.com',
        customerPhone: '+201234567890',
        customerAddress: 'Cairo, Egypt, 11511',
        method: 'Cash',
        amount: '$69.86',
        status: 'Delivered',
        statusColor: 'delivered',
        items: [
          { sr: 1, title: 'Men', quantity: 1, price: '$9.86', amount: '$9.86' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$69.86'
      },
      {
        id: '12144',
        orderTime: '23 Jul, 2025 8:29 AM',
        customerName: 'jean lalong',
        customerEmail: 'jean.lalong@gmail.com',
        customerPhone: '+3312345678',
        customerAddress: 'Brussels, Belgium, 1000',
        method: 'Cash',
        amount: '$162.24',
        status: 'Processing',
        statusColor: 'processing',
        items: [
          { sr: 1, title: 'Shoe', quantity: 1, price: '$102.24', amount: '$102.24' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$162.24'
      },
      {
        id: '12140',
        orderTime: '22 Jul, 2025 4:15 PM',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@gmail.com',
        customerPhone: '+6112345678',
        customerAddress: 'Sydney, Australia, 2000',
        method: 'Card',
        amount: '$445.30',
        status: 'Delivered',
        statusColor: 'delivered',
        items: [
          { sr: 1, title: 'Smart Watch', quantity: 1, price: '$385.30', amount: '$385.30' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$445.30'
      },
      {
        id: '12139',
        orderTime: '22 Jul, 2025 11:30 AM',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@gmail.com',
        customerPhone: '+14155552222',
        customerAddress: 'San Francisco, USA, 94102',
        method: 'Cash',
        amount: '$89.50',
        status: 'Processing',
        statusColor: 'processing',
        items: [
          { sr: 1, title: 'Frock', quantity: 1, price: '$29.50', amount: '$29.50' }
        ],
        shippingCost: '$60.00',
        discount: '$0.00',
        totalAmount: '$89.50'
      }
    ];
    setOrders(sampleOrders);
    setFilteredOrders(sampleOrders);
  }, []);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Apply filters immediately for non-date fields
    if (field !== 'startDate' && field !== 'endDate') {
      applyFilters(newFilters);
    }
  };

  const handleFilterClick = () => {
    applyFilters(filters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...orders];

    // Filter by customer name
    if (currentFilters.customerName) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(currentFilters.customerName.toLowerCase())
      );
    }

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(order =>
        order.status.toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

    // Filter by method
    if (currentFilters.method) {
      filtered = filtered.filter(order =>
        order.method.toLowerCase() === currentFilters.method.toLowerCase()
      );
    }

    // Filter by date range
    if (currentFilters.startDate || currentFilters.endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderTime);
        const startDate = currentFilters.startDate ? new Date(currentFilters.startDate) : null;
        const endDate = currentFilters.endDate ? new Date(currentFilters.endDate) : null;

        // Set end date to end of day if provided
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
        }

        // Check if order date is within range
        if (startDate && endDate) {
          return orderDate >= startDate && orderDate <= endDate;
        } else if (startDate) {
          return orderDate >= startDate;
        } else if (endDate) {
          return orderDate <= endDate;
        }
        return true;
      });
    }

    // Filter by order limit
    if (currentFilters.orderLimit) {
      const limit = parseInt(currentFilters.orderLimit);
      filtered = filtered.slice(0, limit);
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilters({
      customerName: '',
      status: '',
      orderLimit: '',
      method: '',
      startDate: '',
      endDate: ''
    });
    setFilteredOrders(orders);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusColor: newStatus.toLowerCase().replace(' ', '')
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    applyFilters(filters);
  };

  const downloadAllOrders = () => {
    // Mock download functionality
    alert('Downloading all orders...');
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedOrder(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className={`orders-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="section-heading">Orders</h1>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-row-1">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by Customer Name"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="select-filter">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>

            <div className="select-filter">
              <select
                value={filters.orderLimit}
                onChange={(e) => handleFilterChange('orderLimit', e.target.value)}
                className="filter-select"
              >
                <option value="">Order limits</option>
                <option value="10">Last 10 orders</option>
                <option value="25">Last 25 orders</option>
                <option value="50">Last 50 orders</option>
                <option value="100">Last 100 orders</option>
              </select>
            </div>

            <div className="select-filter">
              <select
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="filter-select"
              >
                <option value="">Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>

            <button className="download-btn" onClick={downloadAllOrders}>
              <FaDownload />
              Download All Orders
            </button>
          </div>

          <div className="filters-row-2">
            <div className="date-filter">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="date-input"
              />
            </div>

            <div className="date-filter">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="date-input"
              />
            </div>

            <div className="filter-actions">
              <button className="filter-btn" onClick={handleFilterClick}>Filter</button>
              <button className="reset-btn" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          {filteredOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>INVOICE NO</th>
                  <th>ORDER TIME</th>
                  <th>CUSTOMER NAME</th>
                  <th>METHOD</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                  <th>INVOICE</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="invoice-no">{order.id}</td>
                    <td className="order-time">{order.orderTime}</td>
                    <td className="customer-name">{order.customerName}</td>
                    <td className="method">{order.method}</td>
                    <td className="amount">{order.amount}</td>
                    <td className="status">
                      <span className={`status-badge ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="action">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="action-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    </td>
                    <td className="invoice-actions">
                      <button 
                        className="action-btn print-btn" 
                        title="Print Invoice"
                        onClick={() => handleViewInvoice(order)}
                      >
                        <FaPrint />
                      </button>
                      <button 
                        className="action-btn view-btn" 
                        title="View Invoice"
                        onClick={() => handleViewInvoice(order)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders-found">
              <div className="no-orders-content">
                <h3>No orders found</h3>
                <p>No orders match your current filter criteria. Try adjusting your filters or resetting them.</p>
                <button className="reset-filters-btn" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="invoice-modal-overlay" onClick={handleCloseInvoice}>
          <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-container">
              {/* Invoice Header */}
              <div className="invoice-header">
                <div className="invoice-title-section">
                  <h2>INVOICE</h2>
                  <div className="invoice-status">
                    <span className="status-label">STATUS</span>
                    <span className={`status-badge ${selectedOrder.statusColor}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div className="company-info">
                  <div className="company-logo">
                    <span className="logo-icon">🛒</span>
                    <span className="company-name">Stylesphere</span>
                  </div>
                  <div className="company-details">
                    <p>59 Station Rd, Purls Bridge, United Kingdom</p>
                    <p>019579034</p>
                    <p>evanz@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="invoice-info">
                <div className="invoice-date">
                  <h4>DATE</h4>
                  <p>{selectedOrder.orderTime.split(' ')[0] + ' ' + selectedOrder.orderTime.split(' ')[1] + ', ' + selectedOrder.orderTime.split(' ')[2]}</p>
                </div>
                <div className="invoice-number">
                  <h4>INVOICE NO</h4>
                  <p>#{selectedOrder.id}</p>
                </div>
                <div className="invoice-to">
                  <h4>INVOICE TO</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                  <p>{selectedOrder.customerPhone}</p>
                  <p>{selectedOrder.customerAddress}</p>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="invoice-items">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>SR.</th>
                      <th>PRODUCT TITLE</th>
                      <th>QUANTITY</th>
                      <th>ITEM PRICE</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.sr}</td>
                        <td>{item.title}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td className="amount-cell">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Summary */}
              <div className="invoice-summary">
                <div className="summary-item">
                  <span className="summary-label">PAYMENT METHOD</span>
                  <span className="summary-value">{selectedOrder.method}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">SHIPPING COST</span>
                  <span className="summary-value">{selectedOrder.shippingCost}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">DISCOUNT</span>
                  <span className="summary-value">{selectedOrder.discount}</span>
                </div>
                <div className="summary-item total">
                  <span className="summary-label">TOTAL AMOUNT</span>
                  <span className="summary-value total-amount">{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="invoice-modal-actions">
                <button className="print-invoice-btn" onClick={handlePrintInvoice}>
                  <FaPrint />
                  Print Invoice
                </button>
                <button className="close-invoice-btn" onClick={handleCloseInvoice}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

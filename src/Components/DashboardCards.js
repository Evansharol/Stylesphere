import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaShoppingCart, 
  FaUsers, 
  FaBox, 
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { productsAPI } from '../services/api';
import '../styles/DashboardCards.css';

const DashboardCards = ({ theme, onCardClick }) => {
  const [dashboardData, setDashboardData] = useState({
    todayOrders: 0,
    yesterdayOrders: 0,
    thisMonthSales: 0,
    lastMonthSales: 0,
    allTimeSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalStaff: 0,
    activeOrders: 0,
    totalRevenue: 0,
    totalOrders: 0
  });

  const [loading, setLoading] = useState(true);

  // Helper function to get date strings
  const getDateStrings = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    return {
      today: today.toDateString(),
      yesterday: yesterday.toDateString(),
      thisMonth,
      thisYear,
      lastMonth,
      lastMonthYear
    };
  };

  // Helper function to parse date from order time
  const parseOrderDate = (orderTime) => {
    // Expected format: "24 Jul, 2025 1:29 PM"
    try {
      const datePart = orderTime.split(' ').slice(0, 3).join(' ');
      return new Date(datePart);
    } catch (error) {
      console.error('Error parsing date:', orderTime);
      return new Date();
    }
  };

  // Helper function to extract amount from string
  const extractAmount = (amountString) => {
    if (typeof amountString === 'string') {
      return parseFloat(amountString.replace(/[$,]/g, '')) || 0;
    }
    return parseFloat(amountString) || 0;
  };

  // Get real orders data (same data from Orders.js component)
  const getOrdersData = () => [
    {
      id: '12116',
      orderTime: '24 Jul, 2025 1:29 PM',
      customerName: 'John Cena',
      customerEmail: 'justin@gmail.com',
      customerPhone: '+9616566565',
      customerAddress: 'New Delhi, India, 110059',
      method: 'Card',
      amount: '$297.66',
      status: 'Processing'
    },
    {
      id: '12117',
      orderTime: '23 Jul, 2025 2:30 PM',
      customerName: 'Jane Doe',
      customerEmail: 'jane@gmail.com',
      customerPhone: '+9616566566',
      customerAddress: 'Mumbai, India, 400001',
      method: 'Cash',
      amount: '$150.00',
      status: 'Delivered'
    },
    {
      id: '12118',
      orderTime: '23 Jul, 2025 3:45 PM',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@gmail.com',
      customerPhone: '+9616566567',
      customerAddress: 'Bangalore, India, 560001',
      method: 'Card',
      amount: '$89.50',
      status: 'Shipped'
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
      status: 'Pending'
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
      status: 'Processing'
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
      status: 'Pending'
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
      status: 'Delivered'
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
      status: 'Processing'
    },
    {
      id: '12147',
      orderTime: '22 Jul, 2025 10:00 AM',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@gmail.com',
      customerPhone: '+1987654321',
      customerAddress: 'Los Angeles, USA, 90210',
      method: 'Card',
      amount: '$450.00',
      status: 'Delivered'
    },
    {
      id: '12148',
      orderTime: '22 Jul, 2025 3:20 PM',
      customerName: 'Mohammed Ali',
      customerEmail: 'mohammed.ali@gmail.com',
      customerPhone: '+9661234567',
      customerAddress: 'Riyadh, Saudi Arabia, 11564',
      method: 'Cash',
      amount: '$180.50',
      status: 'Processing'
    }
  ];

  // Get real customers data (same data from customers component)
  const getCustomersData = () => [
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
      joiningDate: 'Jul 22, 2025',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '456 Oak Ave, Town'
    },
    {
      id: '2E4F',
      joiningDate: 'Jul 21, 2025',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      address: '789 Pine St, Village'
    },
    {
      id: '3F5G',
      joiningDate: 'Jul 20, 2025',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+5555555555',
      address: '321 Elm St, Suburb'
    },
    {
      id: '4H6I',
      joiningDate: 'Jul 19, 2025',
      name: 'Sarah Davis',
      email: 'sarah@example.com',
      phone: '+7777777777',
      address: '654 Maple Dr, District'
    },
    {
      id: '5J7K',
      joiningDate: 'Jul 18, 2025',
      name: 'Chris Anderson',
      email: 'chris@example.com',
      phone: '+6666666666',
      address: '987 Cedar Ave, Metro'
    },
    {
      id: '6L8M',
      joiningDate: 'Jul 17, 2025',
      name: 'Emily Brown',
      email: 'emily@example.com',
      phone: '+8888888888',
      address: '741 Birch Rd, Township'
    },
    {
      id: '7N9O',
      joiningDate: 'Jul 16, 2025',
      name: 'David Martinez',
      email: 'david@example.com',
      phone: '+9999999999',
      address: '852 Spruce Ln, Borough'
    }
  ];

  // Sample data functions (fallback if no data in localStorage)
  const getSampleCustomers = () => [
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
      joiningDate: 'Jul 22, 2025',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '456 Oak Ave, Town'
    },
    {
      id: '2E4F',
      joiningDate: 'Jul 21, 2025',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      address: '789 Pine St, Village'
    }
  ];

  const getSampleStaff = () => [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@gmail.com',
      contact: '360-943-7332',
      joiningDate: '23 Jul, 2025',
      role: 'Super Admin',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Manager',
      email: 'manager@gmail.com',
      contact: '360-943-7333',
      joiningDate: '22 Jul, 2025',
      role: 'Manager',
      status: 'Active'
    }
  ];

  const getSampleOrders = () => [
    {
      id: '12116',
      orderTime: '24 Jul, 2025 1:29 PM',
      customerName: 'John Cena',
      customerEmail: 'justin@gmail.com',
      customerPhone: '+9616566565',
      customerAddress: 'New Delhi, India, 110059',
      method: 'Card',
      amount: '$297.66',
      status: 'Processing'
    },
    {
      id: '12117',
      orderTime: '23 Jul, 2025 2:30 PM',
      customerName: 'Jane Doe',
      customerEmail: 'jane@gmail.com',
      customerPhone: '+9616566566',
      customerAddress: 'Mumbai, India, 400001',
      method: 'Cash',
      amount: '$150.00',
      status: 'Delivered'
    },
    {
      id: '12118',
      orderTime: '22 Jul, 2025 3:15 PM',
      customerName: 'Bob Wilson',
      customerEmail: 'bob@gmail.com',
      customerPhone: '+9616566567',
      customerAddress: 'Bangalore, India, 560001',
      method: 'Card',
      amount: '$89.99',
      status: 'Processing'
    }
  ];

  const getSampleProducts = () => [
    {
      id: 1,
      name: 'Smartphone',
      price: 299.99,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Laptop',
      price: 799.99,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Coffee Mug',
      price: 12.99,
      category: 'Home'
    }
  ];

  // Fallback function for when API fails - memoized with useCallback
  const fallbackToSampleData = useCallback(() => {
    const calculateDashboardData = () => {
      try {
        // Get data from localStorage or use sample data
        const customersData = JSON.parse(localStorage.getItem('customers')) || getSampleCustomers();
        const staffData = JSON.parse(localStorage.getItem('staff')) || getSampleStaff();
        const ordersData = JSON.parse(localStorage.getItem('orders')) || getSampleOrders();
        const productsData = JSON.parse(localStorage.getItem('products')) || getSampleProducts();

        const dates = getDateStrings();
        
        // Calculate order metrics
        let todayOrders = 0;
        let yesterdayOrders = 0;
        let thisMonthSales = 0;
        let lastMonthSales = 0;
        let allTimeSales = 0;
        let activeOrders = 0;

        ordersData.forEach(order => {
          const orderDate = parseOrderDate(order.orderTime);
          const orderAmount = extractAmount(order.amount);
          allTimeSales += orderAmount;

          // Check if order is from today
          if (orderDate.toDateString() === dates.today) {
            todayOrders += orderAmount;
          }

          // Check if order is from yesterday
          if (orderDate.toDateString() === dates.yesterday) {
            yesterdayOrders += orderAmount;
          }

          // Check if order is from this month
          if (orderDate.getMonth() === dates.thisMonth && orderDate.getFullYear() === dates.thisYear) {
            thisMonthSales += orderAmount;
          }

          // Check if order is from last month
          if (orderDate.getMonth() === dates.lastMonth && orderDate.getFullYear() === dates.lastMonthYear) {
            lastMonthSales += orderAmount;
          }

          // Count active orders (assuming non-delivered orders are active)
          if (order.status && order.status.toLowerCase() !== 'delivered') {
            activeOrders++;
          }
        });

        setDashboardData({
          todayOrders,
          yesterdayOrders,
          thisMonthSales,
          lastMonthSales,
          allTimeSales,
          totalProducts: productsData.length,
          totalCustomers: customersData.length,
          totalStaff: staffData.length,
          activeOrders,
          totalRevenue: allTimeSales,
          totalOrders: ordersData.length
        });

      } catch (error) {
        console.error('Error calculating dashboard data:', error);
      }
    };

    calculateDashboardData();
  }, []);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        
        // Fetch real products data from API
        const productsData = await productsAPI.getAll();
        
        // Get orders data (from Orders.js component data)
        const ordersData = getOrdersData();
        
        // Get customers data (from Customers.js component data)
        const customersData = getCustomersData();

        const dates = getDateStrings();
        
        // Calculate order metrics
        let todayOrders = 0;
        let yesterdayOrders = 0;
        let thisMonthSales = 0;
        let lastMonthSales = 0;
        let allTimeSales = 0;
        let activeOrders = 0;

        ordersData.forEach(order => {
          const orderDate = parseOrderDate(order.orderTime);
          const orderAmount = extractAmount(order.amount);
          allTimeSales += orderAmount;

          // Check if order is from today
          if (orderDate.toDateString() === dates.today) {
            todayOrders += orderAmount;
          }

          // Check if order is from yesterday
          if (orderDate.toDateString() === dates.yesterday) {
            yesterdayOrders += orderAmount;
          }

          // Check if order is from this month
          if (orderDate.getMonth() === dates.thisMonth && orderDate.getFullYear() === dates.thisYear) {
            thisMonthSales += orderAmount;
          }

          // Check if order is from last month
          if (orderDate.getMonth() === dates.lastMonth && orderDate.getFullYear() === dates.lastMonthYear) {
            lastMonthSales += orderAmount;
          }

          // Count active orders (assuming non-delivered orders are active)
          if (order.status && order.status.toLowerCase() !== 'delivered') {
            activeOrders++;
          }
        });

        setDashboardData({
          todayOrders,
          yesterdayOrders,
          thisMonthSales,
          lastMonthSales,
          allTimeSales,
          totalProducts: productsData.length, // Real products count from API
          totalCustomers: customersData.length, // Real customers count
          totalStaff: 0,
          activeOrders,
          totalRevenue: allTimeSales,
          totalOrders: ordersData.length // Real orders count
        });

      } catch (error) {
        console.error('Error fetching real data:', error);
        // Fallback to sample data if API fails
        fallbackToSampleData();
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();

    // Set up an interval to update data every minute
    const interval = setInterval(fetchRealData, 60000);

    return () => clearInterval(interval);
  }, [fallbackToSampleData]);

  const cards = [
    {
      title: 'Total Orders',
      value: dashboardData.totalOrders,
      icon: FaShoppingCart,
      color: '#2563eb',
      growth: null,
      isPositive: true,
      route: 'Orders'
    },
    {
      title: 'Total Products',
      value: dashboardData.totalProducts,
      icon: FaBox,
      color: '#10b981',
      growth: null,
      isPositive: true,
      route: 'Products'
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers,
      icon: FaUsers,
      color: '#f59e0b',
      growth: null,
      isPositive: true,
      route: 'Customer'
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardData.totalRevenue.toFixed(2)}`,
      icon: FaShoppingCart,
      color: '#ef4444',
      growth: null,
      isPositive: true,
      route: 'Orders' // Revenue card goes to orders since revenue comes from orders
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-cards">
        <div className="loading-message">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-cards">
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`dashboard-card ${theme === 'dark' ? 'dark' : ''} clickable-card`}
            style={{ '--card-color': card.color }}
            onClick={() => onCardClick && onCardClick(card.route)}
            title={`Click to view ${card.title.toLowerCase()}`}
          >
            <div className="card-header">
              <div className="card-icon">
                <card.icon />
              </div>
              {card.growth !== null && (
                <div className={`growth-indicator ${card.isPositive ? 'positive' : 'negative'}`}>
                  {card.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(card.growth)}%
                </div>
              )}
            </div>
            <div className="card-content">
              <h3 className="card-value">{card.value}</h3>
              <p className="card-title">{card.title}</p>
            </div>
            <div className="card-footer">
              <div className="card-accent"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;

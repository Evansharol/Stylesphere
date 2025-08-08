import React, { useState } from 'react';
import { 
  FaPlus, 
  FaTrash, 
  FaSearch, 
  FaEye, 
  FaFileImport,
  FaFilter,
  FaRedo,
  FaEdit
} from 'react-icons/fa';

import '../styles/Products.css';

const Products = ({ theme = 'light' }) => {
  // State for storing products list
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Classic White T-Shirt',
      category: 'Men',
      price: '25.00',
      salePrice: '20.00',
      stock: 50,
      description: 'A timeless white t-shirt for everyday wear.',
      status: 'Selling',
      published: true,
      imageUrl: '',
    },
    {
      id: 2,
      name: 'Elegant Handbag',
      category: 'Women',
      price: '120.00',
      salePrice: '99.00',
      stock: 15,
      description: 'Stylish handbag for all occasions.',
      status: 'Selling',
      published: true,
      imageUrl: '',
    },
    {
      id: 3,
      name: 'Running Shoes',
      category: 'Footwear',
      price: '75.00',
      salePrice: '65.00',
      stock: 30,
      description: 'Comfortable running shoes for men and women.',
      status: 'Selling',
      published: true,
      imageUrl: '',
    },
    {
      id: 4,
      name: 'Leather Belt',
      category: 'Accessories',
      price: '35.00',
      salePrice: '30.00',
      stock: 40,
      description: 'Premium quality leather belt.',
      status: 'Selling',
      published: true,
      imageUrl: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for the form (add/edit)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
    status: 'Selling',
    published: true,
    imageUrl: ''
  });

  // New states for image handling
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // State for controlling modal visibility
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New states for advanced features
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    status: ''
  });

  // Load products when component mounts




  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    
    let matchesPrice = true;
    if (filters.priceRange) {
      const price = parseFloat(product.price);
      switch (filters.priceRange) {
        case 'under50':
          matchesPrice = price < 50;
          break;
        case '50to100':
          matchesPrice = price >= 50 && price <= 100;
          break;
        case 'over100':
          matchesPrice = price > 100;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new product
  const handleAddProduct = () => {
    setFormData({
      id: null,
      name: '',
      category: '',
      price: '',
      salePrice: '',
      stock: '',
      description: '',
      status: 'Selling',
      published: true,
      imageUrl: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle checkbox selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      setSelectAll(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      status: ''
    });
    setSearchTerm('');
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image selected:', file.name, file.size);
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log('Image preview created:', previewUrl);
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    try {
      console.log('Starting image upload:', selectedImage.name);
      setUploadingImage(true);
  // Simulate image upload and return a local URL
  const imageData = { imageUrl: imagePreview };
      console.log('Image upload successful:', imageData);
      return imageData.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image: ' + error.message);
      alert('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Open modal for editing existing product
  const handleEditProduct = (product) => {
    setFormData(product);
    setSelectedImage(null);
    setImagePreview(product.imageUrl || '');
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle view product details
  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  // Save product (create or update)
  const handleSaveProduct = async () => {
    console.log('Save product triggered', { isEditing, selectedImage, formData });
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    // For new products, require an image
    if (!isEditing && !selectedImage && !formData.imageUrl) {
      alert('Please upload an image for the product');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload image if new image is selected
      let imageUrl = formData.imageUrl;
      if (selectedImage) {
        console.log('Uploading new image...');
        imageUrl = await uploadImage();
        if (!imageUrl) {
          console.log('Image upload failed, aborting save');
          return; // Upload failed, error already set
        }
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Set sale price to regular price if not specified
      const productData = {
        ...formData,
        salePrice: formData.salePrice || formData.price,
        imageUrl: imageUrl
      };

      if (isEditing) {
        // Update existing product
        // Update existing product in local state
        setProducts(prev => prev.map(product => 
          product.id === formData.id ? { ...productData, id: formData.id } : product
        ));
      } else {
        // Add new product
  // Add new product to local state
  setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
      }

      setShowModal(false);
      setFormData({
        id: null,
        name: '',
        category: '',
        price: '',
        salePrice: '',
        stock: '',
        description: '',
        status: 'Selling',
        published: true,
        imageUrl: ''
      });
      setSelectedImage(null);
      setImagePreview('');
    } catch (error) {
      setError('Failed to save product: ' + error.message);
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        setError('');
  setProducts(prev => prev.filter(product => product.id !== id));
      } catch (error) {
        setError('Failed to delete product: ' + error.message);
        console.error('Error deleting product:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`products-page${theme === 'dark' ? ' dark-theme' : ''}`}>
      {/* Centered Page Title */}
      <div className="page-title-container">
        <h1 className="product-page-heading">Products</h1>
        <span className="product-count">{filteredProducts.length} products</span>
      </div>

      {/* Header with Action Buttons */}
      <div className="products-header">
        <div className="header-left">
          <span className="section-label">Product Actions</span>
        </div>
        
        <div className="header-right">
          <button className="import-btn">
            <FaFileImport /> Import
          </button>
          <button 
            className="delete-btn" 
            onClick={handleBulkDelete}
            disabled={selectedProducts.length === 0}
          >
            <FaTrash /> Delete ({selectedProducts.length})
          </button>
          <button className="add-product-btn" onClick={handleAddProduct}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          {/* Retry button removed since API is not used */}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>

          <select 
            value={filters.priceRange} 
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Price</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="over100">Over $100</option>
          </select>

          <button className="filter-btn">
            <FaFilter /> Filter
          </button>

          <button className="reset-btn" onClick={resetFilters}>
            <FaRedo /> Reset
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-message">
          Loading products...
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>SALE PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>VIEW</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                  {loading ? 'Loading...' : 'No products found'}
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className={selectedProducts.includes(product.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td>
                    <div className="product-cell">
                      <div className="product-image">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                            alt={product.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="product-icon" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
                          {getProductIcon(product.category)}
                        </div>
                      </div>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>${product.salePrice || product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${(product.status || 'Selling').toLowerCase()}`}>
                      {product.status || 'Selling'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewProduct(product)}
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProduct(product)}
                        disabled={loading}
                        title="Edit Product"
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
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {/* Image Upload Section */}
              <div className="form-group">
                <label>Product Image *</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    id="imageUpload"
                    className="file-upload-input"
                  />
                  <label htmlFor="imageUpload" className="file-upload-label">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload Image'}
                    </div>
                    <div className="upload-subtext">
                      Supports: JPG, PNG, GIF (Max 5MB)
                    </div>
                  </label>
                  
                  {(imagePreview || formData.imageUrl) && (
                    <div className="file-preview">
                      <img 
                        src={imagePreview || (formData.imageUrl?.startsWith('http') ? formData.imageUrl : `http://localhost:5000${formData.imageUrl}`)}
                        alt="Product Preview" 
                      />
                      <div className="file-info">
                        <div className="file-name">Product Image</div>
                        <div className="file-size">Image uploaded</div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview('');
                          setFormData(prev => ({...prev, imageUrl: ''}));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Sale Price</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Selling">Selling</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({...prev, published: e.target.checked}))}
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSaveProduct}
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details View Modal */}
      {showViewModal && viewingProduct && (
        <div className="modal-overlay">
          <div className="modal product-details-modal">
            <div className="modal-header">
              <h2>Product Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body product-details-body">
              <div className="product-details-container">
                <div className="product-image-section">
                  <div className="product-main-image">
                    {viewingProduct.imageUrl ? (
                      <img 
                        src={viewingProduct.imageUrl.startsWith('http') ? viewingProduct.imageUrl : `http://localhost:5000${viewingProduct.imageUrl}`}
                        alt={viewingProduct.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="product-fallback-icon" style={{ display: viewingProduct.imageUrl ? 'none' : 'flex' }}>
                      {getProductIcon(viewingProduct.category)}
                    </div>
                  </div>
                </div>

                <div className="product-info-section">
                  <div className="product-status-badge">
                    <span className="status-text">Status: </span>
                    <span className={`status-indicator ${(viewingProduct.status || 'Selling').toLowerCase()}`}>
                      {viewingProduct.status === 'Selling' ? 'This product Showing' : viewingProduct.status}
                    </span>
                  </div>

                  <h1 className="product-title">{viewingProduct.name}</h1>
                  
                  <div className="product-sku">
                    <span className="sku-label">SKU: </span>
                    <span className="sku-value">{viewingProduct.id || 'N/A'}</span>
                  </div>

                  <div className="product-pricing">
                    <span className="price-main">${viewingProduct.price}</span>
                    {viewingProduct.salePrice && viewingProduct.salePrice !== viewingProduct.price && (
                      <span className="price-sale">${viewingProduct.salePrice}</span>
                    )}
                  </div>

                  <div className="product-stock-info">
                    <span className={`stock-status ${parseInt(viewingProduct.stock) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {parseInt(viewingProduct.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="stock-quantity">QUANTITY: {viewingProduct.stock}</span>
                  </div>

                  {viewingProduct.description && (
                    <div className="product-description">
                      <p>{viewingProduct.description}</p>
                    </div>
                  )}

                  <div className="product-meta">
                    <div className="meta-item">
                      <span className="meta-label">Category: </span>
                      <span className="meta-value">{viewingProduct.category}</span>
                    </div>
                  </div>

                  <div className="product-tags">
                    <span className="tag">premium-shirt</span>
                    <span className="tag">t-shirt</span>
                    <span className="tag">new-t-shirt</span>
                  </div>

                  <div className="product-actions">
                    <button 
                      className="edit-product-btn"
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditProduct(viewingProduct);
                      }}
                    >
                      Edit Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to get product icons
  function getProductIcon(category) {
    const icons = {
      'Men': '👕',
      'Skin Care': '🧴',
      'Fresh Vegetable': '🥬',
      'Fresh Fruits': '🍊', 
      'Clothing': '👕',
      'Electronics': '📱'
    };
    return icons[category] || '📦';
  }
};

export default Products;

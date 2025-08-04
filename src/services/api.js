// API service for handling all product-related API calls
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Products API service
export const productsAPI = {
  // Upload image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header, let browser set it
      });
      
      const result = await handleResponse(response);
      return result.data; // Return image data with imageUrl
    } catch (error) {
      handleError(error);
    }
  },

  // GET /api/products - Fetch all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const result = await handleResponse(response);
      return result.data; // Return just the products array
    } catch (error) {
      handleError(error);
    }
  },

  // GET /api/products/:id - Fetch single product
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      handleError(error);
    }
  },

  // POST /api/products - Create new product
  create: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      handleError(error);
    }
  },

  // PUT /api/products/:id - Update product
  update: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      handleError(error);
    }
  },

  // DELETE /api/products/:id - Delete product
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default productsAPI;

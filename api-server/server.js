const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'products.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!require('fs').existsSync(UPLOADS_DIR)) {
  require('fs').mkdirSync(UPLOADS_DIR);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR)); // Serve uploaded images

// Routes
app.use('/api', authRoutes); // Auth routes (login, register, OTP)

// Initialize products file if it doesn't exist
const initializeData = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with initial data
    const initialData = [
      { id: 1, name: 'T-Shirt', category: 'Clothing', price: 25.99, stock: 100, description: 'Comfortable cotton t-shirt' },
      { id: 2, name: 'Jeans', category: 'Clothing', price: 59.99, stock: 50, description: 'Blue denim jeans' },
      { id: 3, name: 'Sneakers', category: 'Footwear', price: 89.99, stock: 30, description: 'Sport sneakers' }
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Products data file created with initial data');
  }
};

// Helper function to read products from file
const readProducts = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Helper function to write products to file
const writeProducts = async (products) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw error;
  }
};

// API ROUTES

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image: ' + error.message
    });
  }
});

// GET /api/products - Read all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    res.json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Read single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message
    });
  }
});

// POST /api/products - Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, salePrice, stock, description, status, published, imageUrl } = req.body;
    
    // Validation
    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, price, stock'
      });
    }
    
    const products = await readProducts();
    
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name,
      category,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : parseFloat(price),
      stock: parseInt(stock),
      description: description || '',
      status: status || 'Selling',
      published: published !== undefined ? published : true,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, category, price, salePrice, stock, description, status, published, imageUrl } = req.body;
    
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update product
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      category: category || products[productIndex].category,
      price: price !== undefined ? parseFloat(price) : products[productIndex].price,
      salePrice: salePrice !== undefined ? parseFloat(salePrice) : products[productIndex].salePrice,
      stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock,
      description: description !== undefined ? description : products[productIndex].description,
      status: status || products[productIndex].status,
      published: published !== undefined ? published : products[productIndex].published,
      imageUrl: imageUrl !== undefined ? imageUrl : products[productIndex].imageUrl,
      updatedAt: new Date().toISOString()
    };
    
    await writeProducts(products);
    
    res.json({
      success: true,
      data: products[productIndex],
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProducts(products);
    
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
  });
};

startServer();

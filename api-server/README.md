# Products API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### GET /products
Get all products
```
Response: {
  "success": true,
  "data": [array of products],
  "message": "Products retrieved successfully"
}
```

### GET /products/:id
Get single product by ID
```
Response: {
  "success": true,
  "data": {product object},
  "message": "Product retrieved successfully"
}
```

### POST /products
Create new product
```
Body: {
  "name": "Product Name",
  "category": "Category",
  "price": 29.99,
  "stock": 100,
  "description": "Product description"
}

Response: {
  "success": true,
  "data": {created product},
  "message": "Product created successfully"
}
```

### PUT /products/:id
Update existing product
```
Body: {
  "name": "Updated Name",
  "category": "Updated Category",
  "price": 39.99,
  "stock": 150,
  "description": "Updated description"
}

Response: {
  "success": true,
  "data": {updated product},
  "message": "Product updated successfully"
}
```

### DELETE /products/:id
Delete product
```
Response: {
  "success": true,
  "data": {deleted product},
  "message": "Product deleted successfully"
}
```

## How to Start
1. Navigate to api-server folder
2. Run `npm install` (if not done already)
3. Run `npm start`
4. Server will start on http://localhost:5000
5. Data is stored in `products.json` file

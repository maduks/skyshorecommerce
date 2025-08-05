# Skyshore Ecommerce Backend

A complete ecommerce backend API built with Node.js, Express, and MongoDB following the MVC architecture pattern.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management with complete address information
- **Product Management**: CRUD operations for products with categories, tags, and variations
- **Product Tags**: Support for featured, new arrival, trending, sale, bestseller, and more
- **Product Variations**: Size, color, and other customizable options with individual pricing
- **Order Management**: Complete order lifecycle with status tracking
- **Category Management**: Hierarchical category system
- **Rating & Reviews**: Product rating and review system
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling middleware

## Architecture

```
├── controllers/     # Request handlers
├── models/         # Database schemas
├── services/       # Business logic
├── routes/         # API routes
├── middleware/     # Custom middleware
└── server.js       # Application entry point
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Vercel Deployment

This backend is configured for deployment on Vercel. Follow these steps to deploy:

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Environment Variables
Set these environment variables in your Vercel dashboard:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: Set to "production"

### 5. Custom Domain (Optional)
You can add a custom domain in the Vercel dashboard.

### 6. Health Check
After deployment, test the health endpoint:
```
https://your-app.vercel.app/api/health
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommercebackend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=6000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (requires address, phone, state)
- `POST /api/auth/register/admin` - Register a new admin user (Admin only)
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering, pagination, tags)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrival products
- `GET /api/products/sale` - Get products on sale
- `GET /api/products/tag/:tag` - Get products by specific tag
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/specifications` - Get product specifications
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/rating` - Add product rating
- `POST /api/products/:id/tags` - Add tags to product (Admin only)
- `DELETE /api/products/:id/tags` - Remove tags from product (Admin only)
- `PUT /api/products/:id/specifications` - Update product specifications (Admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/payment` - Update payment status (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

## Request Examples

### Register User (Updated)
```bash
curl -X POST http://localhost:6000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1-555-123-4567",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

### Register Admin User (Admin only)
```bash
curl -X POST http://localhost:6000/api/auth/register/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpassword",
    "phone": "+1-555-987-6543",
    "address": {
      "street": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:6000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Update Profile
```bash
curl -X PUT http://localhost:6000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Smith",
    "phone": "+1-555-987-6543",
    "address": {
      "street": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    }
  }'
```

### Create Category (Admin)
```bash
curl -X POST http://localhost:6000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "parent": null
  }'
```

### Create Subcategory (Admin)
```bash
curl -X POST http://localhost:6000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Smartphones",
    "description": "Mobile phones and smartphones",
    "parent": "PARENT_CATEGORY_ID"
  }'
```

### Update Category (Admin)
```bash
curl -X PUT http://localhost:6000/api/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Electronics & Gadgets",
    "description": "Electronic devices, gadgets and accessories"
  }'
```

### Create Product with Tags and Variations (Admin)
```bash
curl -X POST http://localhost:6000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium T-Shirt",
    "description": "High-quality cotton t-shirt with multiple color and size options",
    "price": 29.99,
    "category": "CATEGORY_ID",
    "stock": 100,
    "sku": "TSHIRT-001",
    "images": ["tshirt-red.jpg", "tshirt-blue.jpg"],
    "brand": "Premium Brand",
    "tags": ["featured", "new-arrival", "trending"],
    "featured": true,
    "newArrival": true,
    "specifications": "<h3>Product Specifications</h3><ul><li><strong>Material:</strong> 100% Cotton</li><li><strong>Weight:</strong> 180 GSM</li><li><strong>Fit:</strong> Regular Fit</li><li><strong>Care Instructions:</strong> Machine wash cold, tumble dry low</li><li><strong>Origin:</strong> Made in USA</li><li><strong>Certification:</strong> OEKO-TEX Standard 100</li></ul>",
    "variations": [
      {
        "name": "Size",
        "options": [
          {
            "value": "Small",
            "price": 0,
            "stock": 25,
            "sku": "TSHIRT-001-S"
          },
          {
            "value": "Medium",
            "price": 0,
            "stock": 30,
            "sku": "TSHIRT-001-M"
          },
          {
            "value": "Large",
            "price": 2.00,
            "stock": 25,
            "sku": "TSHIRT-001-L"
          }
        ]
      },
      {
        "name": "Color",
        "options": [
          {
            "value": "Red",
            "price": 0,
            "stock": 40,
            "sku": "TSHIRT-001-RED"
          },
          {
            "value": "Blue",
            "price": 0,
            "stock": 40,
            "sku": "TSHIRT-001-BLUE"
          }
        ]
      }
    ],
    "salePrice": 24.99,
    "saleEndDate": "2024-12-31T23:59:59.000Z"
  }'
```

### Update Product Specifications (Admin)
```bash
curl -X PUT http://localhost:6000/api/products/PRODUCT_ID/specifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "specifications": "<h3>Updated Product Specifications</h3><table><tr><th>Property</th><th>Value</th></tr><tr><td>Material</td><td>100% Organic Cotton</td></tr><tr><td>Weight</td><td>200 GSM</td></tr><tr><td>Fit</td><td>Slim Fit</td></tr></table>"
  }'
```

### Get Product Specifications
```bash
curl -X GET http://localhost:6000/api/products/PRODUCT_ID/specifications
```

### Update Product (Admin)
```bash
curl -X PUT http://localhost:6000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Premium T-Shirt",
    "description": "Updated description for the premium t-shirt",
    "price": 34.99,
    "stock": 150,
    "featured": false,
    "salePrice": 29.99,
    "saleEndDate": "2024-12-31T23:59:59.000Z"
  }'
```

### Add Product Rating
```bash
curl -X POST http://localhost:6000/api/products/PRODUCT_ID/rating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "review": "Excellent quality product! Highly recommended."
  }'
```

### Get Featured Products
```bash
curl -X GET http://localhost:6000/api/products/featured?limit=6
```

### Get New Arrivals
```bash
curl -X GET http://localhost:6000/api/products/new-arrivals?limit=8
```

### Get Products on Sale
```bash
curl -X GET http://localhost:6000/api/products/sale?limit=10
```

### Get Products by Tag
```bash
curl -X GET http://localhost:6000/api/products/tag/featured?limit=5
```

### Add Tags to Product (Admin)
```bash
curl -X POST http://localhost:6000/api/products/PRODUCT_ID/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tags": ["bestseller", "premium"]
  }'
```

### Remove Tags from Product (Admin)
```bash
curl -X DELETE http://localhost:6000/api/products/PRODUCT_ID/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tags": ["trending"]
  }'
```

### Create Order
```bash
curl -X POST http://localhost:6000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderItems": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "PayPal"
  }'
```

### Update Order Status (Admin)
```bash
curl -X PUT http://localhost:6000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

### Update Payment Status (Admin)
```bash
curl -X PUT http://localhost:6000/api/orders/ORDER_ID/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentResult": {
      "id": "PAYMENT_ID_123",
      "status": "completed",
      "update_time": "2024-01-15T10:30:00Z",
      "email_address": "customer@example.com"
    }
  }'
```

### Get All Users (Admin)
```bash
curl -X GET http://localhost:6000/api/users?page=1&limit=10&search=john \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User (Admin)
```bash
curl -X PUT http://localhost:6000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Updated",
    "role": "admin",
    "isActive": true
  }'
```

### Deactivate User (Admin)
```bash
curl -X DELETE http://localhost:6000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Product Tags

The following tags are supported for products:

- **new-arrival**: Recently added products
- **featured**: Highlighted products
- **trending**: Popular products
- **sale**: Products on discount
- **bestseller**: Top-selling products
- **limited-edition**: Special limited products
- **eco-friendly**: Environmentally friendly products
- **premium**: High-end products

## Product Specifications

Products can have detailed specifications stored as HTML content:

- **HTML Content**: Specifications can include formatted text, tables, lists, and styling
- **WYSIWYG Support**: Compatible with rich text editors like TinyMCE, CKEditor, etc.
- **Admin Management**: Update specifications via API
- **Public Access**: Specifications are publicly readable
- **Flexible Format**: Can include tables, lists, images, and any HTML formatting

## Product Variations

Products can have multiple variations (e.g., size, color) with individual:
- Pricing (additional cost)
- Stock levels
- SKU codes

## Query Parameters

### Product Filtering
- `?search=keyword` - Search in name, description, brand
- `?category=CATEGORY_ID` - Filter by category
- `?minPrice=10&maxPrice=100` - Price range filter
- `?tags=featured,new-arrival` - Filter by tags
- `?featured=true` - Featured products only
- `?newArrival=true` - New arrivals only
- `?onSale=true` - Products on sale only
- `?sortBy=price&sortOrder=asc` - Sort products
- `?page=1&limit=10` - Pagination

### Order Status Values
- `pending` - Order is pending
- `processing` - Order is being processed
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `cancelled` - Order has been cancelled

## Environment Variables

- `PORT`: Server port (default: 6000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled
- Error handling middleware

## Database Models

### User (Updated)
- name, email, password, phone, address (street, city, state, zipCode, country), role, isActive

### Product (Updated)
- name, description, price, category, images, stock, sku, brand, specifications, tags, variations, featured, newArrival, salePrice, saleEndDate, ratings

### Order
- user, orderItems, shippingAddress, paymentMethod, totalPrice, status

### Category
- name, description, slug, parent, isActive

## User Registration Requirements

When registering a new user, the following fields are **required**:

- **name**: User's full name (minimum 2 characters)
- **email**: Valid email address (must be unique)
- **password**: Password (minimum 6 characters)
- **phone**: Phone number
- **address**: Complete address object containing:
  - **street**: Street address
  - **city**: City name
  - **state**: State/province
  - **zipCode**: Postal/ZIP code
  - **country**: Country (defaults to "USA" if not provided)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
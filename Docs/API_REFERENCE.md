# API REFERENCE - POS Restoran

Dokumentasi lengkap untuk semua endpoint API POS Restoran.

---

## 📑 Daftar Isi

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Request/Response Format](#requestresponse-format)
4. [Status Codes](#status-codes)
5. [API Endpoints](#api-endpoints)
   - [Auth](#auth)
   - [Menu](#menu)
   - [Categories](#categories)
   - [Orders](#orders)
   - [Shifts](#shifts)
   - [Tables](#tables)
   - [Reports](#reports)
   - [Users](#users)
   - [Settings](#settings)
   - [Cache](#cache)

---

## Overview

### Base URL
```
Production: https://api.posrestoran.com
Development: http://localhost:3001/api
```

### API Version
- **Current**: v1
- **Format**: RESTful JSON API

### Rate Limiting
- **Limit**: 1000 requests/hour per IP
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### CORS
- Enabled untuk domain terdaftar
- Credentials: Included (untuk session auth)

---

## Authentication

### Session-based Authentication
POS Restoran menggunakan session-based auth (cookies).

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "user123",
    "fullName": "John Doe",
    "role": "kasir",
    "createdAt": "2025-12-15T10:30:00Z"
  }
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "username": "newuser",
  "fullName": "New User",
  "password": "password123",
  "role": "kasir"
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response**:
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

#### Check Session
```http
GET /api/auth/me
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Authentication Headers
Setelah login, session cookie akan otomatis dikirim dengan setiap request.

### Protected Routes
Routes yang memerlukan authentication akan return **401 Unauthorized** jika tidak authenticated.

---

## Request/Response Format

### Standard Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Standard Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2025-12-15T10:30:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details"
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

### Pagination
Endpoints yang mendukung pagination menggunakan:
```
GET /api/endpoint?page=1&limit=20&sort=createdAt&order=desc
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Filtering
```
GET /api/orders?status=completed&startDate=2025-12-01&endDate=2025-12-31
```

---

## Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized (permission denied) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server maintenance |

---

## API Endpoints

---

## Auth

### Login
```http
POST /api/auth/login
```

**Request**:
```json
{
  "email": "kasir@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "user_123",
    "email": "kasir@example.com",
    "username": "kasir01",
    "fullName": "Kasir User",
    "role": "kasir"
  }
}
```

### Register
```http
POST /api/auth/register
```

**Request**:
```json
{
  "email": "newkasir@example.com",
  "username": "newkasir",
  "fullName": "New Kasir",
  "password": "secure_password",
  "role": "kasir"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "user": {
    "id": "user_456",
    "email": "newkasir@example.com",
    "role": "kasir"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### Get Current User
```http
GET /api/auth/me
```

**Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "kasir@example.com",
    "username": "kasir01",
    "role": "kasir"
  }
}
```

---

## Menu

### Get All Menu Items
```http
GET /api/menu?category=beverage&limit=20&page=1
```

**Query Parameters**:
- `category` (optional): Filter by category
- `limit` (optional): Items per page (default: 20)
- `page` (optional): Page number (default: 1)
- `search` (optional): Search by name

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "menu_123",
      "name": "Iced Coffee",
      "description": "Cold coffee beverage",
      "category": {
        "id": "cat_001",
        "name": "Beverage"
      },
      "price": 25000,
      "stock": 50,
      "imageUrl": "https://...",
      "isActive": true,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Get Menu Item by ID
```http
GET /api/menu/menu_123
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "menu_123",
    "name": "Iced Coffee",
    "description": "Cold coffee",
    "category": { "id": "cat_001", "name": "Beverage" },
    "price": 25000,
    "stock": 50,
    "imageUrl": "https://...",
    "isActive": true
  }
}
```

### Create Menu Item
```http
POST /api/menu
Content-Type: multipart/form-data

{
  "name": "Espresso",
  "description": "Double shot espresso",
  "categoryId": "cat_001",
  "price": 30000,
  "stock": 100,
  "image": <file>,
  "isActive": true
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Menu berhasil ditambahkan",
  "data": {
    "id": "menu_new_456",
    "name": "Espresso",
    "price": 30000
  }
}
```

### Update Menu Item
```http
PUT /api/menu/menu_123
Content-Type: multipart/form-data

{
  "name": "Espresso Double",
  "price": 35000,
  "stock": 80,
  "image": <file> (optional)
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Menu berhasil diperbarui"
}
```

### Delete Menu Item
```http
DELETE /api/menu/menu_123
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Menu berhasil dihapus"
}
```

---

## Categories

### Get All Categories
```http
GET /api/categories?limit=50&page=1
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "name": "Beverage",
      "itemCount": 12,
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": "cat_002",
      "name": "Food",
      "itemCount": 25,
      "createdAt": "2025-01-02T00:00:00Z"
    }
  ]
}
```

### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Dessert"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "id": "cat_003",
    "name": "Dessert"
  }
}
```

### Update Category
```http
PUT /api/categories/cat_001
Content-Type: application/json

{
  "name": "Hot Beverage"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Kategori berhasil diperbarui"
}
```

### Delete Category
```http
DELETE /api/categories/cat_001
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Kategori berhasil dihapus"
}
```

---

## Orders

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "tableId": "table_5",
  "items": [
    {
      "menuId": "menu_123",
      "quantity": 2,
      "notes": "Extra hot"
    },
    {
      "menuId": "menu_456",
      "quantity": 1
    }
  ],
  "paymentMethod": "cash",
  "customerName": "John Doe"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": "order_789",
    "orderNumber": "ORD-20251215-001",
    "tableId": "table_5",
    "totalItems": 3,
    "subtotal": 80000,
    "tax": 8000,
    "total": 88000,
    "status": "pending",
    "createdAt": "2025-12-15T10:30:00Z"
  }
}
```

### Get All Orders
```http
GET /api/orders?status=completed&startDate=2025-12-01&limit=20&page=1
```

**Query Parameters**:
- `status` (optional): pending, completed, cancelled
- `startDate` (optional): ISO date format
- `endDate` (optional): ISO date format
- `tableId` (optional): Filter by table
- `limit` (optional): Items per page
- `page` (optional): Page number

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "order_789",
      "orderNumber": "ORD-20251215-001",
      "tableId": "table_5",
      "totalItems": 3,
      "total": 88000,
      "status": "completed",
      "createdAt": "2025-12-15T10:30:00Z",
      "items": [
        {
          "menuId": "menu_123",
          "name": "Iced Coffee",
          "quantity": 2,
          "price": 25000,
          "notes": "Extra hot"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Get Order by ID
```http
GET /api/orders/order_789
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "orderNumber": "ORD-20251215-001",
    "tableId": "table_5",
    "items": [...],
    "subtotal": 80000,
    "tax": 8000,
    "total": 88000,
    "status": "completed",
    "paymentMethod": "cash",
    "createdAt": "2025-12-15T10:30:00Z",
    "completedAt": "2025-12-15T10:45:00Z"
  }
}
```

### Update Order Status
```http
PUT /api/orders/order_789/status
Content-Type: application/json

{
  "status": "completed"
}
```

**Valid statuses**: pending, in_progress, completed, cancelled

**Response (200)**:
```json
{
  "success": true,
  "message": "Status pesanan berhasil diperbarui"
}
```

### Cancel Order
```http
DELETE /api/orders/order_789
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Pesanan berhasil dibatalkan"
}
```

---

## Shifts

### Start New Shift
```http
POST /api/shifts/start
Content-Type: application/json

{
  "notes": "Morning shift"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "shift_001",
    "userId": "user_123",
    "startTime": "2025-12-15T07:00:00Z",
    "notes": "Morning shift",
    "status": "active"
  }
}
```

### End Shift
```http
POST /api/shifts/shift_001/end
Content-Type: application/json

{
  "notes": "Finished morning orders"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Shift berhasil ditutup",
  "data": {
    "id": "shift_001",
    "startTime": "2025-12-15T07:00:00Z",
    "endTime": "2025-12-15T15:00:00Z",
    "duration": "8 hours",
    "totalOrders": 45,
    "totalRevenue": 1250000,
    "status": "closed"
  }
}
```

### Get Shift History
```http
GET /api/shifts?userId=user_123&startDate=2025-12-01&limit=20
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "shift_001",
      "userId": "user_123",
      "startTime": "2025-12-15T07:00:00Z",
      "endTime": "2025-12-15T15:00:00Z",
      "duration": "8 hours",
      "totalOrders": 45,
      "totalRevenue": 1250000,
      "status": "closed"
    }
  ]
}
```

### Get Active Shift
```http
GET /api/shifts/active
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "shift_002",
    "startTime": "2025-12-15T15:00:00Z",
    "elapsedTime": "2 hours 30 minutes",
    "ordersCount": 12,
    "currentRevenue": 450000,
    "status": "active"
  }
}
```

---

## Tables

### Get All Tables
```http
GET /api/tables
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "table_1",
      "number": 1,
      "capacity": 4,
      "location": "Front",
      "status": "available",
      "currentOrderId": null
    },
    {
      "id": "table_2",
      "number": 2,
      "capacity": 6,
      "location": "Back",
      "status": "occupied",
      "currentOrderId": "order_789"
    }
  ]
}
```

### Create Table
```http
POST /api/tables
Content-Type: application/json

{
  "number": 10,
  "capacity": 8,
  "location": "VIP Section"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Meja berhasil ditambahkan",
  "data": {
    "id": "table_10",
    "number": 10,
    "capacity": 8
  }
}
```

### Update Table Status
```http
PUT /api/tables/table_1/status
Content-Type: application/json

{
  "status": "occupied"
}
```

**Valid statuses**: available, occupied, reserved, maintenance

**Response (200)**:
```json
{
  "success": true,
  "message": "Status meja berhasil diperbarui"
}
```

### Delete Table
```http
DELETE /api/tables/table_1
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Meja berhasil dihapus"
}
```

---

## Reports

### Get Sales Report
```http
GET /api/reports/sales?startDate=2025-12-01&endDate=2025-12-31&period=daily
```

**Query Parameters**:
- `startDate` (required): ISO date
- `endDate` (required): ISO date
- `period` (optional): daily, weekly, monthly

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "period": "2025-12-01 to 2025-12-31",
    "totalOrders": 450,
    "totalRevenue": 15250000,
    "totalTax": 1525000,
    "averageOrderValue": 33889,
    "dailyData": [
      {
        "date": "2025-12-15",
        "orders": 12,
        "revenue": 450000
      }
    ],
    "topItems": [
      {
        "id": "menu_123",
        "name": "Iced Coffee",
        "quantity": 125,
        "revenue": 3125000
      }
    ]
  }
}
```

### Get Top Selling Items
```http
GET /api/reports/top-items?days=30
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "menu_123",
      "name": "Iced Coffee",
      "quantity": 250,
      "revenue": 6250000,
      "rank": 1
    }
  ]
}
```

### Get Revenue by Payment Method
```http
GET /api/reports/payment-methods?startDate=2025-12-01&endDate=2025-12-31
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "cash": 8000000,
    "card": 5250000,
    "qris": 2000000,
    "total": 15250000
  }
}
```

---

## Users

### Get All Users
```http
GET /api/users?role=kasir&limit=50&page=1
```

**Query Parameters**:
- `role` (optional): admin, kasir
- `limit` (optional): Items per page
- `page` (optional): Page number

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "kasir@example.com",
      "username": "kasir01",
      "fullName": "Kasir User",
      "role": "kasir",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5
  }
}
```

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "username": "newuser",
  "fullName": "New User",
  "password": "secure_password",
  "role": "kasir"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User berhasil dibuat"
}
```

### Update User
```http
PUT /api/users/user_123
Content-Type: application/json

{
  "fullName": "Updated Name",
  "email": "newemail@example.com"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "User berhasil diperbarui"
}
```

### Delete User
```http
DELETE /api/users/user_123
```

**Response (200)**:
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

---

## Settings

### Get Settings
```http
GET /api/settings
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "restaurantName": "My Restaurant",
    "address": "123 Main St",
    "phone": "+62-123-4567",
    "email": "contact@restaurant.com",
    "openingTime": "10:00",
    "closingTime": "22:00",
    "taxPercentage": 10,
    "serviceChargePercentage": 5,
    "currency": "IDR"
  }
}
```

### Update Settings
```http
PUT /api/settings
Content-Type: application/json

{
  "restaurantName": "Updated Restaurant",
  "taxPercentage": 12,
  "serviceChargePercentage": 8
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Pengaturan berhasil diperbarui"
}
```

---

## Cache

### Clear Cache
```http
POST /api/cache/clear
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Cache berhasil dihapus"
}
```

### Warm Cache
```http
POST /api/cache/warm
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Cache berhasil di-warm"
}
```

### Get Cache Stats
```http
GET /api/cache/stats
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "hitRate": "87.5%",
    "missRate": "12.5%",
    "totalRequests": 1000,
    "cacheSize": "15.2 MB"
  }
}
```

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| `AUTH_FAILED` | Authentication failed | Check credentials |
| `UNAUTHORIZED` | Not authorized to access | Check permissions |
| `VALIDATION_ERROR` | Request validation failed | Check parameters |
| `RESOURCE_NOT_FOUND` | Resource tidak ditemukan | Check ID/parameters |
| `DUPLICATE_RESOURCE` | Resource sudah ada | Use different value |
| `SERVER_ERROR` | Server error | Retry atau contact support |
| `RATE_LIMIT_EXCEEDED` | Request limit exceeded | Wait before retry |
| `INVALID_FILE_FORMAT` | Format file tidak valid | Use correct format |

---

## Best Practices

### 1. Error Handling
Always check `success` field dan handle errors:
```javascript
const response = await fetch('/api/menu');
if (!response.ok) {
  const data = await response.json();
  console.error(data.message);
}
```

### 2. Pagination
Gunakan pagination untuk large datasets:
```
GET /api/orders?limit=20&page=1
```

### 3. Date Format
Gunakan ISO 8601 format:
```
2025-12-15T10:30:00Z
```

### 4. Caching
Cache GET requests untuk improve performance:
- Menu items (1 hour)
- Categories (1 hour)
- Settings (24 hours)

### 5. Rate Limiting
Respect rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Webhooks (Coming Soon)

Fitur webhook akan diluncurkan di v2.0 untuk:
- Order notifications
- Payment updates
- Inventory alerts
- Shift events

---

**API Version**: 1.0  
**Last Updated**: Januari 2026  
**Status**: Stable  
**Support**: api-support@posrestoran.com

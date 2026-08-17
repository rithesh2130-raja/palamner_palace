# ShopSphere API Specification & Guidelines

## 🌐 API Base URL

`http://localhost:5000/api/v1`

## 🏥 Health Endpoint

- **Endpoint:** `GET /api/v1/health`
- **Access:** Public
- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": true,
  "message": "ShopSphere API is running",
  "timestamp": "2026-08-17T22:45:00.000Z",
  "data": {
    "backend": "Connected",
    "database": "Connected"
  }
}
```

## 📋 Standard Response Envelopes

### Success Response:

```json
{
  "success": true,
  "data": {}
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

## 🚥 Future Domain API Prefix Blueprint

- Auth: `/api/v1/auth`
- Users: `/api/v1/users`
- Products: `/api/v1/products`
- Reels: `/api/v1/reels`
- Orders: `/api/v1/orders`
- Creators: `/api/v1/creators`
- Admin: `/api/v1/admin`

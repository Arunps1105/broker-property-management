# 📡 API Testing & Documentation Guide

Complete guide for testing the Broker Property Management API endpoints.

## 🧪 Testing Setup

### Tools Required

- **Postman** or **Insomnia** (API testing)
- **cURL** (command line)
- **pytest** (backend automated tests)
- **Jest** (frontend automated tests)

## 🔐 Authentication Flow

### 1. Login

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "profile": {
      "is_broker": true,
      "phone": "",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. Check Authentication

**Request:**
```bash
curl -X GET http://localhost:8000/api/auth/check/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**Response:**
```json
{
  "authenticated": true,
  "user": {...}
}
```

### 3. Get Current User

**Request:**
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Cookie: sessionid=<your-session-id>"
```

### 4. Logout

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Cookie: sessionid=<your-session-id>"
```

## 🏠 Property Endpoints

### List Properties

**Basic Request:**
```bash
curl -X GET http://localhost:8000/api/properties/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**With Filters:**
```bash
curl -X GET "http://localhost:8000/api/properties/?search=kakkanad&bhk=2&status=available&rent_min=10000&rent_max=50000" \
  -H "Cookie: sessionid=<your-session-id>"
```

**Query Parameters:**
- `search` - Search across all properties
- `place` - Filter by place
- `bhk` - Filter by BHK
- `status` - available, rented, sold
- `rent_min` - Minimum rent
- `rent_max` - Maximum rent
- `house_type` - apartment, villa, house, land, commercial
- `furnishing` - unfurnished, semi-furnished, furnished
- `parking` - true/false
- `power_backup` - true/false
- `ordering` - -created_at (newest), -rent (highest price)
- `page` - Pagination

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/properties/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "owner_name": "John Broker",
      "place": "Kakkanad",
      "bhk": 2,
      "rent": 25000,
      "status": "available",
      "house_type": "apartment",
      "created_at": "2024-01-15T10:30:00Z",
      "first_image": "https://res.cloudinary.com/...",
      "images_count": 3,
      "primary_phone": "9876543210",
      "area": "Infopark"
    }
  ]
}
```

### Get Property Detail

**Request:**
```bash
curl -X GET http://localhost:8000/api/properties/1/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**Response:**
```json
{
  "id": 1,
  "owner_name": "John Broker",
  "primary_phone": "9876543210",
  "secondary_phone": "9123456789",
  "whatsapp_number": "919876543210",
  "place": "Kakkanad",
  "area": "Infopark",
  "complete_address": "Plot 123, Infopark, Kakkanad, Kochi 682042",
  "google_maps_link": "https://maps.google.com/...",
  "olx_link": "https://www.olx.in/...",
  "latitude": 10.1234,
  "longitude": 76.5678,
  "bhk": 2,
  "floor": 4,
  "house_type": "apartment",
  "rent": 25000,
  "advance": 75000,
  "square_feet": 1200,
  "parking": true,
  "water_availability": "24/7",
  "power_backup": true,
  "furnishing_status": "semi-furnished",
  "facilities": "Gym, Pool, Security, Lift, Parking",
  "description": "Beautiful 2 BHK apartment near Infopark...",
  "broker_notes": "Negotiable, Good family preferred",
  "status": "available",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:45:00Z",
  "images": [
    {
      "id": 1,
      "image": "https://res.cloudinary.com/...",
      "uploaded_at": "2024-01-15T10:30:00Z",
      "order": 0
    }
  ]
}
```

### Create Property

**Request (Multipart Form Data):**
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Cookie: sessionid=<your-session-id>" \
  -F "owner_name=John Broker" \
  -F "primary_phone=9876543210" \
  -F "place=Kakkanad" \
  -F "bhk=2" \
  -F "rent=25000" \
  -F "house_type=apartment" \
  -F "status=available" \
  -F "complete_address=Plot 123, Infopark" \
  -F "image_uploads=@/path/to/image1.jpg" \
  -F "image_uploads=@/path/to/image2.jpg"
```

**Required Fields:**
- `owner_name` - string
- `primary_phone` - string (max 15 chars)
- `place` - string
- `bhk` - integer (≥1)
- `rent` - integer (≥0)
- `house_type` - string (apartment, villa, house, land, commercial)
- `status` - string (available, rented, sold)
- `image_uploads` - array of files (max 10)

**Response (201 Created):**
```json
{
  "id": 2,
  "owner_name": "John Broker",
  ...
}
```

### Update Property

**Request:**
```bash
curl -X PATCH http://localhost:8000/api/properties/1/ \
  -H "Cookie: sessionid=<your-session-id>" \
  -H "Content-Type: application/json" \
  -d '{
    "rent": 26000,
    "status": "rented",
    "advance": 78000
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  ...
}
```

### Delete Property

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/properties/1/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**Response (204 No Content):**
```
(empty response)
```

### Get Statistics

**Request:**
```bash
curl -X GET http://localhost:8000/api/properties/statistics/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**Response:**
```json
{
  "total_properties": 50,
  "available_properties": 35,
  "rented_properties": 10,
  "sold_properties": 5,
  "properties_by_place": {
    "Kakkanad": 20,
    "Infopark": 15,
    "Aluva": 10,
    "Kottayam": 5
  },
  "properties_by_bhk": {
    "1": 10,
    "2": 25,
    "3": 12,
    "4": 3
  },
  "properties_by_status": {
    "available": 35,
    "rented": 10,
    "sold": 5
  },
  "average_rent": 27500.0,
  "total_rent_value": 962500.0
}
```

### Get Recent Properties

**Request:**
```bash
curl -X GET http://localhost:8000/api/properties/recent_properties/ \
  -H "Cookie: sessionid=<your-session-id>"
```

**Response:**
```json
[
  {
    "id": 50,
    "owner_name": "...",
    ...
  },
  {
    "id": 49,
    ...
  }
]
```

## 🔍 Search & Filter Examples

### Search by Location
```bash
curl "http://localhost:8000/api/properties/?search=kakkanad"
```

### Filter by Price Range
```bash
curl "http://localhost:8000/api/properties/?rent_min=20000&rent_max=30000"
```

### Filter by BHK and Status
```bash
curl "http://localhost:8000/api/properties/?bhk=2&status=available"
```

### Complex Query
```bash
curl "http://localhost:8000/api/properties/?search=apartment&place=kakkanad&bhk=2&rent_min=15000&rent_max=40000&status=available&ordering=-rent"
```

### Pagination
```bash
curl "http://localhost:8000/api/properties/?page=1&page_size=12"
```

## 🧪 Using Postman

### Import Collection

1. Create new Collection: "Broker Property API"
2. Add folder: "Authentication"
3. Add folder: "Properties"
4. Add folder: "Search & Filter"

### Authentication Tests

**Test 1: Login**
- Method: POST
- URL: `{{base_url}}/auth/login/`
- Body (JSON):
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- Tests:
  ```javascript
  pm.test("Login successful", function() {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
    pm.expect(pm.response.json().success).to.equal(true);
  });
  pm.environment.set("token", pm.response.json().user.id);
  ```

**Test 2: Get Current User**
- Method: GET
- URL: `{{base_url}}/auth/me/`
- Headers: Cookie from login
- Tests:
  ```javascript
  pm.test("User data returned", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().username).to.exist;
  });
  ```

### Property Tests

**Test 3: List Properties**
- Method: GET
- URL: `{{base_url}}/properties/?page=1`
- Tests:
  ```javascript
  pm.test("Properties returned", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(pm.response.json().results).to.be.an('array');
  });
  ```

**Test 4: Create Property**
- Method: POST
- URL: `{{base_url}}/properties/`
- Body (form-data):
  - owner_name: John
  - primary_phone: 9876543210
  - place: Kakkanad
  - bhk: 2
  - rent: 25000
  - house_type: apartment
  - status: available
  - image_uploads: (select file)

**Test 5: Update Property**
- Method: PATCH
- URL: `{{base_url}}/properties/{{property_id}}/`
- Body (JSON):
  ```json
  {
    "rent": 26000
  }
  ```

**Test 6: Delete Property**
- Method: DELETE
- URL: `{{base_url}}/properties/{{property_id}}/`

## 🔗 cURL Cheat Sheet

### With Authentication Cookie
```bash
COOKIE="sessionid=your-session-id"
curl -H "Cookie: $COOKIE" http://localhost:8000/api/properties/
```

### POST with JSON Data
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Cookie: sessionid=<id>" \
  -H "Content-Type: application/json" \
  -d '{"owner_name":"John","primary_phone":"9876543210"}'
```

### POST with Form Data
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Cookie: sessionid=<id>" \
  -F "owner_name=John" \
  -F "image_uploads=@image.jpg"
```

### PATCH Request
```bash
curl -X PATCH http://localhost:8000/api/properties/1/ \
  -H "Cookie: sessionid=<id>" \
  -H "Content-Type: application/json" \
  -d '{"rent":26000}'
```

### DELETE Request
```bash
curl -X DELETE http://localhost:8000/api/properties/1/ \
  -H "Cookie: sessionid=<id>"
```

## 🐍 Python Testing

### Using Requests Library

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"
SESSION = requests.Session()

# Login
response = SESSION.post(f"{BASE_URL}/auth/login/", json={
    "username": "admin",
    "password": "password123"
})
print("Login:", response.json())

# Get properties
response = SESSION.get(f"{BASE_URL}/properties/")
properties = response.json()
print(f"Found {properties['count']} properties")

# Get specific property
response = SESSION.get(f"{BASE_URL}/properties/1/")
property_detail = response.json()
print("Property:", property_detail['owner_name'])

# Create property with image
files = {
    'image_uploads': open('photo.jpg', 'rb')
}
data = {
    'owner_name': 'John',
    'primary_phone': '9876543210',
    'place': 'Kakkanad',
    'bhk': 2,
    'rent': 25000,
    'house_type': 'apartment',
    'status': 'available'
}
response = SESSION.post(f"{BASE_URL}/properties/", files=files, data=data)
print("Created:", response.json())

# Update property
response = SESSION.patch(f"{BASE_URL}/properties/1/", json={'rent': 26000})
print("Updated:", response.json())

# Delete property
response = SESSION.delete(f"{BASE_URL}/properties/1/")
print("Deleted:", response.status_code)

# Logout
SESSION.post(f"{BASE_URL}/auth/logout/")
```

## 📊 Performance Testing

### Apache Bench
```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8000/api/properties/

# With cookie
ab -n 100 -c 10 -C "sessionid=<your-session-id>" http://localhost:8000/api/properties/
```

### Siege
```bash
# Load testing
siege -c 25 -r 5 http://localhost:8000/api/properties/
```

## ✅ Common Test Cases

| Test | Method | URL | Expected |
|------|--------|-----|----------|
| Login | POST | /auth/login/ | 200, user data |
| List | GET | /properties/ | 200, array |
| Search | GET | /properties/?search=x | 200, filtered |
| Create | POST | /properties/ | 201, property |
| Update | PATCH | /properties/1/ | 200, updated |
| Delete | DELETE | /properties/1/ | 204 |
| Get stats | GET | /properties/statistics/ | 200, stats |

## 🐛 Debugging Tips

### View Response Headers
```bash
curl -v http://localhost:8000/api/properties/
```

### Pretty Print JSON
```bash
curl http://localhost:8000/api/properties/ | python -m json.tool
```

### Save Response to File
```bash
curl http://localhost:8000/api/properties/ > properties.json
```

### Check Status Code
```bash
curl -w "\nStatus: %{http_code}\n" http://localhost:8000/api/properties/
```

## 📝 Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```

---

**Last Updated:** 2024

For API documentation, check `/api/docs/` (if Swagger enabled)

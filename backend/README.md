# Medimate Backend Documentation

## Overview

The backend is a Node.js/Express.js server that provides RESTful API endpoints for user authentication and medication management. It uses MongoDB for data persistence and JWT for secure authentication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Port**: 5000 (default)

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/medimate
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema & methods
│   │   └── Medication.js        # Medication schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic (register, login, getMe)
│   │   └── medicationController.js  # CRUD operations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── medicationRoutes.js  # Medication endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   └── server.js                # Express app setup
├── package.json
├── .env.example
└── .gitignore
```

## Installation & Running

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server with hot reload
npm run dev

# Start production server
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Medications

- `GET /api/medications` - Get all medications (protected)
- `GET /api/medications/today` - Get today's medications (protected)
- `GET /api/medications/upcoming` - Get upcoming medications (protected)
- `POST /api/medications` - Create medication (protected)
- `PUT /api/medications/:id` - Update medication (protected)
- `DELETE /api/medications/:id` - Delete medication (protected)

## Middleware

### JWT Authentication Middleware (`protect`)

Verifies JWT token from request headers:

```javascript
const token = req.headers.authorization.split(' ')[1]; // "Bearer token"
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.id;
```

## Models

### User Model

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, valid),
  password: String (required, hashed, min 6 chars),
  timestamps: true
}

Methods:
- matchPassword(enteredPassword) // Async comparison
```

### Medication Model

```javascript
{
  userId: ObjectId (ref: User),
  medicineName: String,
  dosage: String,
  frequency: String,
  time: String (HH:MM),
  startDate: Date,
  endDate: Date,
  notes: String,
  active: Boolean,
  timestamps: true
}

Indexes:
- userId + startDate (for faster queries)
```

## Error Handling

All errors return structured JSON responses:

```json
{
  "message": "Error description"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request / validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Database Connection

MongoDB is connected using Mongoose:

```javascript
const mongoose = require('mongoose');

await mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

Connection is established on server startup and errors are logged.

## Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: Signed with secret, expiry of 7 days
- **Route Protection**: Middleware verifies token on protected routes
- **User Isolation**: Users can only access their own data
- **Input Validation**: All inputs validated before processing
- **CORS Enabled**: Allows requests from frontend

## Example Requests

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token to use in Authorization header.

### Create Medication

```bash
POST /api/medications
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicineName": "Aspirin",
  "dosage": "500mg",
  "frequency": "Once Daily",
  "time": "09:00",
  "startDate": "2026-01-15",
  "endDate": "2026-02-15",
  "notes": "Take with food"
}
```

## Debugging

Enable debug logging:

```javascript
// In server.js
if (process.env.NODE_ENV === 'development') {
  console.log('Debug mode enabled');
}
```

Common issues:
- MongoDB not running: Start with `mongod`
- JWT_SECRET not set: Check `.env` file
- CORS errors: Check frontend URL in CORS config
- Token errors: Ensure "Bearer " prefix in Authorization header

---

For more info, see main README.md

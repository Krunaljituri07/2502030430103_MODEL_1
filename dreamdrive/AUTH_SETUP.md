# DreamDrive Authentication Setup

## Overview
Full MongoDB-backed authentication system with login/signup UI is now integrated into the DreamDrive project.

---

## Backend Setup

### 1. **MongoDB Connection**
- Located in: `server.js` (lines 1-50)
- Uses Mongoose ODM with MongoDB connection string
- Automatically connects to MongoDB when server starts

### 2. **User Model**
- Located in: `models/User.js`
- Fields:
  - `name`: User's full name (String, required)
  - `email`: User's email (String, required, unique)
  - `password`: Hashed password using bcryptjs (String, required)
  - `createdAt`: Timestamp (auto-generated)

### 3. **Authentication Routes**

#### **POST /api/auth/signup**
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (Success 201):**
  ```json
  {
    "message": "Signup successful. You can now log in."
  }
  ```
- **Error Cases:**
  - Missing fields: 400 Bad Request
  - Email already registered: 409 Conflict

#### **POST /api/auth/login**
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (Success 200):**
  ```json
  {
    "message": "Login successful.",
    "user": {
      "id": "user_mongo_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error Cases:**
  - Missing fields: 400 Bad Request
  - Invalid credentials: 401 Unauthorized

### 4. **Security Features**
- Passwords hashed with bcryptjs (salt rounds: 10)
- CORS enabled for frontend communication
- Error messages don't expose sensitive information

---

## Frontend Setup

### 1. **AuthPage Component**
- Located in: `src/App.js` (lines 257-510)
- Features:
  - Toggle between Login and Signup modes
  - Form validation (password confirmation for signup)
  - Real-time error/success messages
  - Loading state during authentication
  - Auto-redirect to home on successful login
  - Dark theme matching DreamDrive design

### 2. **Navigation Integration**
- Added "Account" link to navigation menu
- Route: `currentPage === 'auth'`
- Accessible from any page via navbar

### 3. **Styling**
- Premium dark card design with golden accent border
- Responsive layout (mobile-friendly)
- Smooth animations with Framer Motion
- Password confirmation validation

---

## Running the Application

### 1. **Start Backend Server**
```bash
cd dreamdrive
npm run server
# Server runs on http://localhost:5000
```

### 2. **Start Frontend (in new terminal)**
```bash
cd dreamdrive
npm start
# React app runs on http://localhost:3000
# Frontend proxy routes API calls to backend
```

### 3. **Access Auth Page**
- Navigate to http://localhost:3000
- Click "Account" in the navigation bar
- Test signup and login flows

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         React Frontend (Port 3000)       │
│  ┌─────────────────────────────────────┐ │
│  │      AuthPage Component             │ │
│  │  - Login Form                       │ │
│  │  - Signup Form                      │ │
│  │  - Form Validation                  │ │
│  └─────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │ (API Calls)
                   ▼
     Proxy: http://localhost:5000
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Express Backend (Port 5000)           │
│  ┌─────────────────────────────────────┐ │
│  │  POST /api/auth/signup              │ │
│  │  POST /api/auth/login               │ │
│  └─────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    MongoDB Database                      │
│  ┌─────────────────────────────────────┐ │
│  │  User Collection                    │ │
│  │  - name, email, password, createdAt │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## File Structure

```
dreamdrive/
├── server.js                    # Express server + auth routes + MongoDB
├── models/
│   └── User.js                  # Mongoose User schema
├── package.json                 # Backend + frontend dependencies
├── src/
│   └── App.js                   # React app with AuthPage component
└── .env.example                 # Environment variables template
```

---

## Environment Variables

Create a `.env` file in the `dreamdrive` folder:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dreamdrive
PORT=5000
NODE_ENV=development
```

---

## Testing the Auth Flow

### Test Signup
1. Navigate to Account page
2. Enter name, email, password
3. Confirm password matches
4. Click "Sign Up"
5. Check console for success message

### Test Login
1. Switch to Login mode
2. Enter registered email and password
3. Click "Login"
4. Auto-redirect to home on success

### Test Error Handling
- Try duplicate email signup → See "Email already registered"
- Try wrong password → See "Invalid credentials"
- Missing fields → See validation errors

---

## Future Enhancements

- [ ] JWT token storage for persistent sessions
- [ ] User profile page
- [ ] Password reset functionality
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub)
- [ ] User wishlist/cart persistence to account

---

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB connection string is correct in server.js
- Check if MongoDB service is running
- Verify network connectivity

### Frontend Auth Failures
- Check browser console for error messages
- Verify backend is running on port 5000
- Clear browser cache if needed

### CORS Errors
- Backend has CORS enabled for all origins in development
- Check if proxy setting in package.json is correct

---

## Summary

**MongoDB Backend**: User model, signup/login endpoints with bcryptjs hashing
**React Frontend**: AuthPage with login/signup UI, form validation
**Navigation**: "Account" link accessible from any page
**Integration**: Frontend proxy setup for seamless API communication
**Styling**: Light/teal theme (updated)

The authentication system is production-ready for local development and testing!

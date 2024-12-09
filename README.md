# 🏋️ Fitness Tracker Backend

## Overview
A robust backend service for the Fitness Tracker application, built with Node.js, Express, and MongoDB. Provides secure authentication, data management, and API endpoints for fitness tracking.

## 🚀 Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt for password hashing
- Nodemailer for email services

## 📦 Prerequisites
- Node.js (v16+ recommended)
- MongoDB (v5+ recommended)
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/Vigneshwarrs/fit-back/fitness-tracker-backend.git
cd fitness-tracker-backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 🖥️ Available Scripts

- `npm start`: Runs the server
- `npm run dev`: Runs the server with nodemon for development
- `npm test`: Runs test suite (currently not configured)

## 🌟 Key Features
- User Authentication (Register/Login)
- Secure password hashing
- JWT-based authorization
- RESTful API endpoints
- MongoDB data persistence
- Email notifications

## 📂 Project Structure
```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── index.js
```

## 🔒 Authentication Flow
1. User registers with email and password
2. Password is hashed using bcrypt
3. User receives JWT token
4. Token used for subsequent authenticated requests

## 📡 API Endpoints
- `/api/auth`: Authentication routes
- `/api/users`: User management

## 🛡️ Security Measures
- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Environment variable configuration

## 🧪 Testing
- Currently uses basic error logging
- Recommended: Implement Jest for unit and integration testing

## 📦 Dependency Management
- Core Dependencies: Express, Mongoose, JWT
- Development Dependencies: Nodemon, Bcrypt
- Utility Dependencies: Axios, Date-fns, Multer

## 🔐 Environment Configuration
Uses `dotenv` for secure environment variable management

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License.

## 💬 Contact
Vigneshwaran S - vigneshwarrs@outlook.com

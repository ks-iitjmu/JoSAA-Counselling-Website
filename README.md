# JoSAA Counselling System

A modern web-based seat allocation system for JEE counselling with complete authentication and role-based access control. Built with React, TypeScript, Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL v8.0+
- npm

### 1. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE jossaDATABASE;
USE jossaDATABASE;
exit

# Import schema, authentication tables, and sample data
mysql -u root -p jossaDATABASE < DBMS_TermProject.sql
mysql -u root -p jossaDATABASE < authentication.sql
mysql -u root -p jossaDATABASE < insert_sample_data.sql
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file in server directory with:
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=jossaDATABASE
# NODE_ENV=development

npm start
```

### 3. Frontend Setup
```bash
cd client
npm install

# Optional: Create .env file in client directory with:
# VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
```

Visit: **http://localhost:5173**

## 📁 Project Structure

```
project/
├── client/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # Header, UI components
│   │   ├── pages/       # All page components
│   │   ├── services/    # API integration (Axios)
│   │   └── App.tsx      # Main app with routing
│   └── package.json
├── server/              # Node.js + Express backend
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── models/          # Database queries
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── DBMS_TermProject.sql       # Database schema
└── insert_sample_data.sql     # Sample data
```

## 🎯 Features

### Core Features
- ✅ **Candidates** - View registered candidates with JEE ranks
- ✅ **Institutes** - Browse IITs, NITs, IIITs with search/filter
- ✅ **Choice Filling** - Manage program preferences
- ✅ **Allocations** - View seat allocation results by round
- ✅ **Seat Matrix** - Check available seats by category
- ✅ **Opening/Closing Ranks** - View cutoff ranks

### Authentication & Security
- ✅ **User Registration** - Register as Student, Institute, or Admin
- ✅ **Secure Login** - Multi-identifier login (Candidate ID, Email, Mobile, Institute Code)
- ✅ **Role-Based Access** - Different permissions for Students, Institutes, and Administrators
- ✅ **Password Hashing** - Bcrypt encryption for secure password storage
- ✅ **Profile Management** - Update profile and change password
- ✅ **Session Management** - Persistent authentication state

## 🔐 Authentication System

### User Roles

1. **Student**
   - Register with Candidate ID, personal details, and JEE information
   - Login using Candidate ID, Email, or Mobile Number
   - Access student-specific features like choice filling and allocation results

2. **Institute**
   - Register with Institute Code and institutional details
   - Login using Institute Code
   - Manage institute-specific data and seat matrix

3. **Administrator**
   - Pre-created admin account for system management
   - Full access to all system features and data
   - Default credentials: `username: admin`, `password: admin123`

⚠️ **Important:** Change the default admin password after first login!

### Login Options

- **Students:** Can log in using Candidate ID, Email Address, or Mobile Number
- **Institutes:** Log in using Institute Code
- **Administrators:** Log in using Username

### Authentication Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Register new user (Student/Institute) |
| `/api/auth/login` | POST | Login with identifier and password |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/profile/:userID` | GET | Get user profile |
| `/api/auth/profile/:userID` | PUT | Update user profile |
| `/api/auth/password/:userID` | PUT | Change password |
| `/api/auth/check` | GET | Check if identifier exists |

## 🔧 Tech Stack

**Frontend:** React 19, TypeScript, React Router, Axios, Vite  
**Backend:** Node.js, Express 5, MySQL 8, mysql2, bcrypt  
**Security:** Password hashing, Role-based access control  
**Design:** Material Design principles, responsive CSS

## 📡 API Endpoints

### Public Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/candidates` | GET | All candidates |
| `/api/institutes` | GET | All institutes |
| `/api/allocations` | GET | All allocations |
| `/api/seat-matrix` | GET | Seat availability |
| `/api/opening-closing-ranks` | GET | Cutoff ranks |

### Protected Routes (Require Authentication)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/choices/candidate/:id` | GET | Choices by candidate |
| `/api/choices` | POST | Add new choice |
| `/api/auth/profile/:userID` | GET/PUT | Profile management |
| `/api/auth/password/:userID` | PUT | Change password |

**Full API docs:** See server routes in `server/routes/`

## 🗄️ Database Schema

**Main Tables:**
- `Users` - Authentication and user management
- `Candidate` - Student information with JEE ranks
- `Institute` - IIT/NIT/IIIT details
- `Program` - Academic programs
- `Institute_Program` - Institute-program mapping
- `Choice_List` - Candidate preferences
- `Allocation` - Seat allocation results
- `Seat_Matrix` - Available seats by category
- `Opening_Closing_Ranks` - Cutoff data
- `Counselling_Round` - Round schedules

### Users Table Structure
```sql
CREATE TABLE Users (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(255) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
  Role ENUM('Student', 'Institute', 'Administrator') NOT NULL,
  Email VARCHAR(255) UNIQUE NOT NULL,
  IsActive TINYINT(1) DEFAULT 1,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastLogin TIMESTAMP NULL,
  CandidateID INT UNIQUE NULL,  -- For students
  InstituteCode VARCHAR(20) UNIQUE NULL,  -- For institutes
  FOREIGN KEY (CandidateID) REFERENCES Candidate(CandidateID),
  FOREIGN KEY (InstituteCode) REFERENCES Institute(InstituteCode)
);
```

## 🧪 Testing the System

### 1. Register as Student
- Navigate to `/register`
- Select "Student" role
- Fill in required fields including Candidate ID
- Create a password (minimum 6 characters)
- Submit the form

### 2. Register as Institute
- Navigate to `/register`
- Select "Institute" role
- Fill in institutional details including Institute Code
- Create a password
- Submit the form

### 3. Login
- Navigate to `/login`
- Enter your identifier (Candidate ID, Email, Mobile, Institute Code, or Username)
- Enter your password
- Click Login
- After successful login, you'll see your name and role badge in the header

### 4. Default Admin Access
- Username: `admin`
- Password: `admin123`
- ⚠️ **Important:** Change this password immediately after first login!

## 🛡️ Security Features

1. **Password Hashing:** All passwords are hashed using bcrypt with salt rounds
2. **Role-Based Access:** Users are assigned specific roles with different permissions
3. **Login Attempt Logging:** All login attempts (successful and failed) are logged
4. **Session Management:** User data stored in localStorage
5. **Input Validation:** Both frontend and backend validation for all forms

## 🐛 Troubleshooting

### Database Connection Issues
- Check your MySQL credentials in the `.env` file
- Ensure MySQL server is running
- Verify database name matches in `.env` and schema files

### bcrypt Installation Issues (Windows)
If you encounter bcrypt installation errors:
```bash
npm install --global windows-build-tools
npm install bcrypt
```

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change PORT in `server/.env`
- Update VITE_API_BASE_URL in `client/.env` accordingly

### CORS Issues
Ensure the backend CORS configuration allows requests from your frontend URL.

## 🚀 Future Enhancements

1. **JWT Authentication:** Replace localStorage with JWT tokens for better security
2. **Password Reset:** Implement forgot password functionality
3. **Email Verification:** Add email verification for new registrations
4. **Two-Factor Authentication:** Add 2FA for enhanced security
5. **Role-Based Routing:** Create protected routes for different user roles
6. **Audit Logs:** Track all user actions for security and compliance

## 📝 Notes

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- Sample data includes 5 institutes, 8 programs, 5 candidates
- Update your database password in the `.env` file

## 👥 Project

DBMS Term Project - JoSAA Seat Allocation System with Authentication

---

**Version:** 2.0.0 (with Authentication)  
**Last Updated:** November 9, 2025  
**Contributors:** DBMS Project Team


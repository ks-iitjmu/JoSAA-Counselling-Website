# JoSAA Counselling System

A modern, secure web-based seat allocation system for JEE counselling with complete authentication and role-based access control. Built with React, TypeScript, Node.js, Express, and MySQL.

## � Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Authentication System](#-authentication-system)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles & Permissions](#-user-roles--permissions)
- [Contributing](#-contributing)
- [Testing](#-testing)

## ✨ Features

### Core Features
- ✅ **Role-Based Access Control** - Student, Institute, and Administrator roles
- ✅ **Secure Authentication** - Login/logout with session management
- ✅ **Student Portal** - View profile, allocations, and manage choice filling
- ✅ **Institute Portal** - Manage institute information
- ✅ **Admin Dashboard** - Complete system control
- ✅ **Public Data Access** - Seat matrix and opening/closing ranks accessible to all
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT-ready authentication system
- ✅ SQL injection protection
- ✅ Role-based route protection
- ✅ Automatic session handling
- ✅ Data isolation per user role

## �🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- MySQL v8.0 or higher
- npm or yarn package manager

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE jossaDATABASE;
USE jossaDATABASE;
exit

# Import all schemas and sample data
mysql -u root -p jossaDATABASE < DBMS_TermProject.sql
mysql -u root -p jossaDATABASE < authentication.sql
mysql -u root -p jossaDATABASE < insert_sample_data.sql
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jossaDATABASE
NODE_ENV=development
EOF

# Start the server
npm start
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd client
npm install

# Optional: Create .env file for custom API URL
# echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start the development server
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🔐 Authentication System

### Overview
The application implements a comprehensive role-based authentication system that controls access to data based on user roles and login status.

### Authentication Flow
```
User Login → Validate Credentials → Store User Data → Include Auth Headers in Requests
           ↓                                                    ↓
    Generate Session                                    Check Role & Permissions
           ↓                                                    ↓
    Return User Data                                    Allow/Deny Access
```

### Authentication Headers
All authenticated requests automatically include:
```javascript
{
  'x-user-id': userID,
  'x-user-role': 'Student' | 'Institute' | 'Administrator',
  'x-candidate-id': candidateID,      // for students
  'x-institute-code': instituteCode   // for institutes
}
```

### Session Management
- User data stored in browser's localStorage
- Automatic redirect to login on 401 (Unauthorized)
- Session cleared on logout
- Persistent across browser refreshes

## 📁 Project Structure

```
project/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   └── Header.tsx      # Navigation with role-based menu
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Candidates.tsx  # Student profile (protected)
│   │   │   ├── Allocations.tsx # Seat allocations (protected)
│   │   │   ├── ChoiceFilling.tsx # Choice management (student only)
│   │   │   ├── Institutes.tsx  # Institute listing
│   │   │   ├── SeatMatrix.tsx  # Public seat matrix
│   │   │   └── Ranks.tsx       # Public opening/closing ranks
│   │   ├── services/
│   │   │   └── api.ts          # API client with auth interceptors
│   │   └── utils/
│   │       └── auth.ts         # Authentication utilities
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── config/
│   │   └── database.js         # MySQL connection
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Login/register/logout
│   │   ├── candidateController.js
│   │   ├── instituteController.js
│   │   ├── choiceController.js
│   │   └── commonController.js
│   ├── middleware/
│   │   └── auth.js             # Authentication & authorization
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── candidates.js       # Protected routes
│   │   ├── institutes.js       # Mixed public/protected
│   │   ├── choices.js          # Student-only routes
│   │   └── common.js           # Mixed routes
│   └── server.js               # Express app setup
│
├── DBMS_TermProject.sql        # Main database schema
├── authentication.sql          # Authentication tables
├── insert_sample_data.sql      # Sample data for testing
└── README.md                   # This file
```

## 🎭 User Roles & Permissions

### Public Access (No Login Required)
```
✅ View Seat Matrix (all seats by institute, program, category)
✅ View Opening/Closing Ranks (cutoffs for all programs)
✅ View Institutes (basic information, list all IITs/NITs/IIITs)
✅ View Programs (available programs and degrees)
✅ View Counselling Rounds (active and past rounds)
❌ View Candidates (requires authentication)
❌ View Allocations (requires authentication)
❌ Fill Choices (requires student login)
```

### Student Access (After Login)
```
✅ View OWN profile and information
✅ Update OWN profile (limited fields: mobile, email)
✅ View OWN allocations across all rounds
✅ Fill and manage OWN choice list
   - Add choices (institute + program combinations)
   - Reorder choices (drag and drop priority)
   - Delete choices
   - Lock/unlock choice list
✅ View all public data (seat matrix, ranks, institutes)
❌ View other students' information
❌ Edit institutes or system data
❌ Create allocations
```

### Institute Access (After Login)
```
✅ View OWN institute detailed information
✅ Update OWN institute info (address, phone, website, email)
✅ View basic information of other institutes
✅ View all public data
❌ View student personal information
❌ Edit other institutes
❌ Access student-specific features
```

### Administrator Access (After Login)
```
✅ Full CRUD access to all candidates
✅ Full CRUD access to all institutes
✅ View and manage all allocations
✅ Create and manage programs
✅ Manage seat matrix (add/update seats)
✅ Manage opening/closing ranks
✅ Create and manage counselling rounds
✅ Complete system oversight
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "role": "Student" | "Institute",
  // For Student
  "candidateID": 123456,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "dateOfBirth": "2005-01-15",
  "gender": "Male",
  "mobileNumber": "9876543210",
  // ... other student fields
  
  // For Institute
  "instituteCode": "INST001",
  "instituteName": "Example IIT",
  "email": "admin@iit.ac.in",
  "password": "securepassword",
  // ... other institute fields
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "candidate@email.com" | "123456" | "INST001",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userID": 1,
      "username": "john_doe",
      "role": "Student",
      "email": "john@example.com",
      "candidateID": 123456,
      // ... other user data
    }
  }
}
```

### Public Endpoints (No Auth Required)

#### Get Seat Matrix
```http
GET /api/seat-matrix
GET /api/seat-matrix/institute/IIT001

Response: List of available seats by category
```

#### Get Opening/Closing Ranks
```http
GET /api/opening-closing-ranks
GET /api/opening-closing-ranks/round/1
GET /api/opening-closing-ranks/search?rank=500&category=OPEN

Response: Rank data for programs
```

#### Get Institutes
```http
GET /api/institutes
GET /api/institutes/IIT001
GET /api/institutes/with-programs

Response: Institute information
```

### Protected Endpoints (Auth Required)

All protected endpoints require authentication headers:
```http
x-user-id: <userID>
x-user-role: Student | Institute | Administrator
x-candidate-id: <candidateID>  (for students)
x-institute-code: <instituteCode>  (for institutes)
```

#### Candidate Endpoints
```http
GET    /api/candidates           # Admin: all, Student: own only
GET    /api/candidates/:id       # Admin/Student (own): view
PUT    /api/candidates/:id       # Admin: full, Student: limited
DELETE /api/candidates/:id       # Admin only
```

#### Allocation Endpoints
```http
GET /api/allocations/candidate/:candidateId  # Own allocations
GET /api/allocations/round/:roundId          # Admin only
POST /api/allocations                        # Admin only
```

#### Choice Endpoints (Student Only)
```http
GET    /api/choices/candidate/:candidateId  # View own choices
POST   /api/choices                          # Add choice
PUT    /api/choices/:choiceId/order          # Reorder
POST   /api/choices/lock                     # Lock choices
DELETE /api/choices/:choiceId                # Delete choice
```

## 🧪 Testing

### Quick Test Checklist

#### 1. Without Login (Public Access)
- [ ] Open `http://localhost:5173`
- [ ] Navigate to "Seat Matrix" → Should work ✅
- [ ] Navigate to "Ranks" → Should work ✅
- [ ] Navigate to "Institutes" → Should work ✅
- [ ] Try "Candidates" → Should redirect to login 🔒
- [ ] Try "Choice Filling" → Should not appear in menu ❌

#### 2. As Student
- [ ] Login with student credentials
- [ ] "Choice Filling" appears in navigation menu ✅
- [ ] Go to "Candidates" → See only your profile
- [ ] Go to "Allocations" → See only your allocations
- [ ] Go to "Choice Filling" → Manage your choices
- [ ] Try accessing another student's data → Should be denied

#### 3. As Institute
- [ ] Login with institute credentials
- [ ] "Choice Filling" does NOT appear in menu ❌
- [ ] View your institute details
- [ ] Try to edit your institute → Should work
- [ ] Try to edit another institute → Should be denied

#### 4. As Administrator
- [ ] Login with admin credentials
- [ ] "Choice Filling" does NOT appear in menu ❌
- [ ] Access all pages
- [ ] View all data
- [ ] Perform CRUD operations

### Automated Testing
```bash
# Test public and protected routes
./test-auth.sh

# The script will test:
# - Public endpoints (should return 200)
# - Protected endpoints without auth (should return 401)
```

### Manual API Testing with curl

Test public access:
```bash
curl http://localhost:5000/api/seat-matrix
curl http://localhost:5000/api/opening-closing-ranks
```

Test protected access (should fail):
```bash
curl http://localhost:5000/api/candidates
# Expected: 401 Unauthorized
```

Test with authentication:
```bash
# First login to get user data
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"student@email.com","password":"password123"}'

# Then use returned userID and role in headers
curl http://localhost:5000/api/candidates/123 \
  -H "x-user-id: 1" \
  -H "x-user-role: Student" \
  -H "x-candidate-id: 123"
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/DBMS_Project.git
   cd DBMS_Project
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### Code Style Guidelines

#### Frontend (React/TypeScript)
- Use functional components with hooks
- Type all props and state
- Use meaningful variable names
- Add JSDoc comments for complex functions

#### Backend (Node.js/Express)
- Follow MVC pattern
- Use async/await for database operations
- Add error handling for all routes
- Validate input data

#### Database
- Use parameterized queries (prevent SQL injection)
- Follow naming conventions: PascalCase for tables, camelCase for fields
- Add indexes for frequently queried columns

### Adding New Features

#### Adding a New Protected Route

1. **Create controller function** (`server/controllers/yourController.js`):
```javascript
exports.yourFunction = async (req, res) => {
  try {
    // Check user role
    if (req.user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Your logic here
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

2. **Add route** (`server/routes/yourRoute.js`):
```javascript
const { isAuthenticated } = require('../middleware/auth');
router.get('/your-route', isAuthenticated, yourController.yourFunction);
```

3. **Create frontend API call** (`client/src/services/api.ts`):
```typescript
export const yourAPI = {
  getData: () => api.get('/your-route')
};
```

#### Adding a New Page

1. **Create page component** (`client/src/pages/YourPage.tsx`)
2. **Add route** in `App.tsx`
3. **Add navigation link** in `Header.tsx` (with role check if needed)

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solution:** Check your `.env` file has correct MySQL credentials

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process using port or change PORT in `.env`
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
# Or change port
PORT=5001 npm start
```

#### Authentication Not Working
**Solution:** 
1. Clear browser localStorage
2. Check if user data is being stored after login
3. Verify auth headers are being sent in network tab
4. Check server logs for authentication errors

#### 401 Unauthorized on Protected Routes
**Solution:**
1. Ensure you're logged in
2. Check localStorage has 'user' and 'isAuthenticated' keys
3. Verify headers are included in request (check Network tab)

#### Student Sees No Data on Candidates Page
**Solution:**
1. Verify candidateID in localStorage matches database
2. Check server logs for query errors
3. Ensure candidate record exists in database

## 📚 Database Schema

### Key Tables

- **User** - Authentication (UserID, Username, PasswordHash, Role)
- **Candidate** - Student information (CandidateID, Name, Email, JEE ranks)
- **Institute** - College information (InstituteCode, Name, Type)
- **Program** - Academic programs (ProgramCode, Name, Degree, Duration)
- **ChoiceList** - Student preferences (ChoiceID, CandidateID, ProgramCode)
- **Allocation** - Seat assignments (AllocationID, CandidateID, ProgramCode, Round)
- **SeatMatrix** - Available seats (InstituteCode, ProgramCode, Category, Seats)
- **OpeningClosingRanks** - Cutoff ranks (ProgramCode, Category, Round, Opening, Closing)

### Relationships

```
User → Candidate (one-to-one via CandidateID)
User → Institute (one-to-one via InstituteCode)
Candidate → ChoiceList (one-to-many)
Candidate → Allocation (one-to-many)
Institute → Program (one-to-many)
Program → SeatMatrix (one-to-many)
Program → OpeningClosingRanks (one-to-many)
```

## 📄 License

This project is created for educational purposes as part of a Database Management Systems course project.

## 👥 Authors

- Student Project Team
- IIT Jammu

## 📧 Support

For issues, questions, or contributions, please:
1. Check the troubleshooting section
2. Review existing issues on GitHub
3. Create a new issue with detailed description

---

**🎉 Happy Coding!** If you find this project helpful, please give it a star ⭐

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


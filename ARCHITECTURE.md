# JoSAA Counselling System - Complete Architecture Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Architecture](#database-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [File Structure Explained](#file-structure-explained)
7. [Authentication & Authorization](#authentication--authorization)
8. [API Endpoints](#api-endpoints)
9. [Data Flow](#data-flow)
10. [Setup & Installation](#setup--installation)

---

## 🎯 Project Overview

The **JoSAA (Joint Seat Allocation Authority) Counselling System** is a full-stack web application that simulates the college admission counselling process for JEE (Joint Entrance Examination). It manages:

- **Student Registration & Profile Management**
- **Institute Management**
- **Choice Filling** (students can select institute-program preferences)
- **Seat Allocation** based on ranks and choices
- **Opening/Closing Ranks** tracking
- **Role-Based Access Control** (Students, Institutes, Administrators)

---

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router DOM 7.9.5** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **Vite 7.1.7** - Fast build tool and dev server
- **CSS3** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MySQL 8.0** - Relational database
- **MySQL2 3.15.3** - MySQL client for Node.js
- **Bcrypt 5.1.1** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variable management

### Development Tools
- **Nodemon 3.1.10** - Auto-restart server on changes
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

---

## 🗄️ Database Architecture

### Database Name: `DBMS_TermProject` or `jossaDATABASE`

### Core Tables

#### 1. **Users**
Stores authentication data for all system users.
```sql
- UserID (PK, AUTO_INCREMENT)
- Username (UNIQUE)
- Password (hashed with bcrypt)
- Role (Student/Institute/Administrator)
- Email (UNIQUE)
- CandidateID (FK, nullable)
- InstituteCode (FK, nullable)
- Created_At
- Last_Login
```

#### 2. **Candidate**
Stores student/candidate information.
```sql
- CandidateID (PK)
- Name
- DateOfBirth
- Gender
- MobileNumber
- EmailAddress
- JEE_Mains_Application_Number
- JEE_Advanced_Application_Number
- StateOfEligibility
- JEE_Mains_AIR (All India Rank)
- JEE_Mains_Category_Rank
- JEE_Advanced_Qualifying_status
- Category (General/OBC/SC/ST/EWS)
- PwD_status (Person with Disability)
- PwD_Category
- DS_Status (Defence Service)
- Twelfth_Aggregate_Percentage
- Twelfth_Top_20_Percentile_Status
- Document_Upload_Status
```

#### 3. **Institute**
Stores participating institute information.
```sql
- InstituteCode (PK)
- InstituteName
- InstituteType (IIT/NIT/IIIT/GFTI)
- Location_State
- Location_City
- Contact_Phone
- Contact_Email
- Website
```

#### 4. **Program**
Academic programs offered by institutes.
```sql
- ProgramCode (PK)
- ProgramName
- Degree (B.Tech/B.Arch/B.S./etc.)
- Duration (years)
- Department
```

#### 5. **Institute_Program**
Maps programs to institutes (many-to-many relationship).
```sql
- InstituteCode (PK, FK)
- ProgramCode (PK, FK)
- Total_Seats
- Available_Seats
```

#### 6. **Seat_Matrix**
Seat distribution by category for each institute-program.
```sql
- SeatMatrixID (PK)
- InstituteCode (FK)
- ProgramCode (FK)
- Category (OPEN/OBC/SC/ST/EWS)
- Quota (AI/HS/OS/GO/etc.)
- Seat_Pool (Gender-Neutral/Female-Only)
- Total_Seats
- Available_Seats
```

#### 7. **Choice_List**
Student's preferred institute-program choices.
```sql
- ChoiceListID (PK)
- CandidateID (FK)
- InstituteCode (FK)
- ProgramCode (FK)
- Choice_Number (priority order: 1, 2, 3...)
- Choice_Lock_Status
- Timestamp
```

#### 8. **Counselling_Round**
Tracks counselling rounds (Round 1, 2, 3, etc.).
```sql
- RoundID (PK)
- Round_Number
- Start_Date
- End_Date
- Choice_Filling_Start
- Choice_Filling_End
- Seat_Allotment_Result_Date
- Status (Upcoming/Active/Completed)
```

#### 9. **Allocation**
Final seat allocation results.
```sql
- AllocationID (PK)
- CandidateID (FK)
- RoundID (FK)
- AllocatedInstituteCode (FK)
- AllocatedProgramCode (FK)
- Action (Freeze/Float/Slide)
- Fee_Payment_Status
- Allocation_Timestamp
```

#### 10. **Opening_Closing_Ranks**
Historical rank data for programs.
```sql
- RankID (PK)
- InstituteCode (FK)
- ProgramCode (FK)
- Year
- Round_Number
- Category
- Quota
- Seat_Pool
- Opening_Rank
- Closing_Rank
```

### Relationships
- Users ↔ Candidate (1:1)
- Users ↔ Institute (1:1)
- Institute ↔ Program (Many:Many via Institute_Program)
- Candidate ↔ Choice_List (1:Many)
- Candidate ↔ Allocation (1:Many)
- Counselling_Round ↔ Allocation (1:Many)

---

## 🔧 Backend Architecture

### Directory Structure
```
server/
├── server.js              # Entry point, Express app setup
├── package.json           # Dependencies and scripts
├── config/
│   └── database.js        # MySQL connection pool configuration
├── controllers/           # Business logic
│   ├── authController.js
│   ├── candidateController.js
│   ├── instituteController.js
│   ├── choiceController.js
│   ├── allocationController.js
│   └── commonController.js
├── middleware/
│   └── auth.js           # Authentication & authorization middleware
├── models/               # Database interaction layer
│   ├── User.js
│   ├── Candidate.js
│   ├── Institute.js
│   ├── Program.js
│   ├── ChoiceList.js
│   ├── Allocation.js
│   ├── SeatMatrix.js
│   ├── OpeningClosingRanks.js
│   └── CounsellingRound.js
└── routes/               # API endpoint definitions
    ├── auth.js
    ├── candidates.js
    ├── institutes.js
    ├── choices.js
    ├── allocations.js
    └── common.js
```

### Key Backend Files Explained

#### **server.js**
The main entry point of the backend application.
- Sets up Express server
- Configures middleware (CORS, JSON parsing)
- Registers all route handlers
- Implements global error handling
- Handles database constraint errors (foreign keys, duplicates)
- Provides health check endpoint

**Key Features:**
```javascript
- CORS enabled for frontend communication
- JSON request body parsing
- Route organization (/api/auth, /api/candidates, etc.)
- Database error handling (ER_DUP_ENTRY, ER_ROW_IS_REFERENCED_2)
- 404 handler for undefined routes
```

#### **config/database.js**
Database connection management.
- Creates MySQL connection pool (max 10 connections)
- Loads database credentials from environment variables
- Tests connection on startup
- Exports pool for use across the application

**Environment Variables Used:**
- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database username (default: root)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: DBMS_TermProject)

#### **middleware/auth.js**
Authentication and authorization middleware.

**Functions:**
1. **isAuthenticated** - Checks if user is logged in
   - Validates `x-user-id` and `x-user-role` headers
   - Attaches user data to `req.user`

2. **hasRole(...roles)** - Checks if user has specific role(s)
   - Usage: `hasRole('Student', 'Administrator')`

3. **isStudent** - Restricts access to students only

4. **isInstitute** - Restricts access to institutes only

5. **isAdmin** - Restricts access to administrators only

6. **isOwnStudentData** - Ensures students can only access their own data

7. **isOwnInstituteData** - Ensures institutes can only access their own data

#### **controllers/authController.js**
Handles authentication operations.

**Key Functions:**
- `register` - Register new users (Student/Institute/Administrator)
  - Validates role and password
  - Creates Candidate or Institute record
  - Creates User account with hashed password
  - Uses database transactions for atomicity

- `login` - Authenticate users
  - Supports login with email or username
  - Verifies password with bcrypt
  - Returns user profile data

- `logout` - User logout (currently placeholder)

- `getProfile` - Get user profile by ID

- `updateProfile` - Update user information

- `changePassword` - Change user password
  - Verifies current password
  - Hashes new password

- `checkIdentifier` - Check if email/username exists

- `getAllUsers` - Admin function to list all users

- `deleteUser` - Admin function to delete users

#### **controllers/candidateController.js**
Manages candidate/student data.

**Functions:**
- `getAllCandidates` - List all candidates (with filtering)
- `getCandidateById` - Get specific candidate details
- `createCandidate` - Add new candidate
- `updateCandidate` - Update candidate information
- `deleteCandidate` - Remove candidate
- `getCandidateRankInfo` - Get rank-related information
- `getCandidateAllocations` - Get allocation history

#### **controllers/instituteController.js**
Manages institute data and programs.

**Functions:**
- `getAllInstitutes` - List all institutes
- `getInstituteById` - Get institute details
- `createInstitute` - Add new institute
- `updateInstitute` - Update institute info
- `deleteInstitute` - Remove institute
- `getInstitutePrograms` - Get programs offered by institute
- `addProgram` - Add new program
- `updateProgram` - Update program details
- `deleteProgram` - Remove program

#### **controllers/choiceController.js**
Handles choice filling operations.

**Functions:**
- `getChoicesByCandidate` - Get student's choice list
- `saveChoices` - Save/update choice preferences
- `deleteChoice` - Remove a choice
- `lockChoices` - Lock choices after finalization
- `unlockChoices` - Unlock for modifications
- `reorderChoices` - Change priority order

#### **controllers/allocationController.js**
Manages seat allocation process.

**Functions:**
- `getAllocations` - Get allocation results
- `getAllocationsByCandidate` - Student's allocation history
- `getAllocationsByInstitute` - Institute's allocated students
- `createAllocation` - Create new allocation
- `updateAllocation` - Update allocation status
- `deleteAllocation` - Remove allocation
- `runAllocationAlgorithm` - Execute seat allocation algorithm

#### **controllers/commonController.js**
Handles public data accessible to all users.

**Functions:**
- `getPrograms` - List all programs
- `getSeatMatrix` - Get seat matrix data
- `getOpeningClosingRanks` - Get rank cutoffs
- `getCounsellingRounds` - Get round information

#### **models/** (Data Access Layer)
Each model file contains database query logic:
- SQL query construction
- Parameter binding to prevent SQL injection
- Connection pool usage
- Transaction management
- Error handling

**Example Pattern:**
```javascript
static async getAll() {
  const [rows] = await db.query('SELECT * FROM TableName');
  return rows;
}

static async getById(id) {
  const [rows] = await db.query('SELECT * FROM TableName WHERE ID = ?', [id]);
  return rows[0];
}
```

#### **routes/** (API Endpoint Definitions)
Maps HTTP methods and paths to controller functions.

**Example Pattern:**
```javascript
router.get('/', middleware, controller.getAll);
router.get('/:id', middleware, controller.getById);
router.post('/', middleware, controller.create);
router.put('/:id', middleware, controller.update);
router.delete('/:id', middleware, controller.delete);
```

---

## 🎨 Frontend Architecture

### Directory Structure
```
client/
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── public/                # Static assets
└── src/
    ├── main.tsx           # React app entry point
    ├── App.tsx            # Main app component with routing
    ├── App.css            # Global styles
    ├── index.css          # Base styles
    ├── assets/            # Images, fonts, etc.
    ├── components/        # Reusable components
    │   ├── Header.tsx
    │   ├── Header.css
    │   ├── CandidateModal.tsx
    │   ├── CandidateModal.css
    │   ├── InstituteModal.tsx
    │   ├── InstituteModal.css
    │   ├── ConfirmationDialog.tsx
    │   └── ConfirmationDialog.css
    ├── pages/             # Page components
    │   ├── Home.tsx
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── Profile.tsx
    │   ├── Candidates.tsx
    │   ├── Institutes.tsx
    │   ├── ChoiceFilling.tsx
    │   ├── Allocations.tsx
    │   ├── SeatMatrix.tsx
    │   ├── Ranks.tsx
    │   ├── AdminDashboard.tsx
    │   ├── UserManagement.tsx
    │   └── [corresponding .css files]
    ├── services/
    │   └── api.ts         # API client and endpoint functions
    └── utils/
        └── auth.ts        # Authentication helper functions
```

### Key Frontend Files Explained

#### **main.tsx**
React application entry point.
- Imports React and ReactDOM
- Renders the root `<App />` component
- Mounts app to `#root` div in index.html

#### **App.tsx**
Main application component.
- Sets up React Router with all routes
- Includes `<Header />` component on all pages
- Defines route structure:
  - Public routes: `/`, `/login`, `/register`, `/seat-matrix`, `/ranks`
  - Student routes: `/profile`, `/choice-filling`, `/allocations`
  - Institute routes: `/institutes`
  - Admin routes: `/admin/dashboard`, `/admin/users`, etc.
- Includes footer with quick links and branding

#### **components/Header.tsx**
Navigation bar component.
- Shows different navigation items based on user role
- Displays user information when logged in
- Logout functionality
- Responsive mobile menu

**Features:**
- Public nav: Home, Institutes, Seat Matrix, Ranks
- Student nav: + Profile, Choice Filling, My Allocations
- Institute nav: + My Institute
- Admin nav: + Admin Dashboard, User Management

#### **components/CandidateModal.tsx**
Modal dialog for adding/editing candidates.
- Form with all candidate fields
- Validation
- Submit to API
- Used in admin panel

#### **components/InstituteModal.tsx**
Modal dialog for adding/editing institutes.
- Institute information form
- Program management
- API integration

#### **components/ConfirmationDialog.tsx**
Reusable confirmation dialog.
- Generic confirm/cancel modal
- Used for delete confirmations
- Customizable message and actions

#### **pages/Home.tsx**
Landing page.
- Shows different dashboards based on role
- Student: Profile summary, allocations, quick actions
- Institute: Institute info, programs
- Admin: System statistics
- Public: Welcome message, how it works

#### **pages/Login.tsx**
User login page.
- Email/username and password form
- Calls `authAPI.login()`
- Stores user data in localStorage
- Redirects based on role

#### **pages/Register.tsx**
User registration page.
- Role selection (Student/Institute)
- Role-specific forms
- Validation (password strength, required fields)
- Calls `authAPI.register()`
- Auto-login after registration

#### **pages/Profile.tsx**
User profile management.
- Display user information
- Edit profile
- Change password
- Role-specific data display

#### **pages/Candidates.tsx**
Candidate management (Admin only).
- List all candidates
- Search and filter
- Add/Edit/Delete candidates
- View details in modal

#### **pages/Institutes.tsx**
Institute management.
- Institute: View and edit own institute
- Admin: Manage all institutes
- Program management
- CRUD operations

#### **pages/ChoiceFilling.tsx**
Student choice filling interface.
- Search and add institute-program combinations
- Drag-and-drop to reorder choices
- Lock/unlock choices
- View seat matrix and rank cutoffs
- Submit choices

**Features:**
- Priority ordering (1, 2, 3...)
- Real-time validation
- Save progress
- Choice locking for finalization

#### **pages/Allocations.tsx**
Allocation results page.
- Student: View own allocations
- Admin: View all allocations
- Filter by round
- Allocation status (Freeze/Float/Slide)
- Fee payment status

#### **pages/SeatMatrix.tsx**
Public seat matrix viewer.
- Filter by institute, program, category
- Shows available seats
- Category-wise distribution
- Quota information

#### **pages/Ranks.tsx**
Opening/closing ranks viewer.
- Historical rank data
- Filter by year, round, institute, program
- Category-wise cutoffs
- Helps students in choice filling

#### **pages/AdminDashboard.tsx**
Administrator dashboard.
- System statistics
- Total users, candidates, institutes
- Recent activities
- Quick access to management pages
- System health status

#### **pages/UserManagement.tsx**
User account management (Admin only).
- List all users
- User roles
- Linked candidates/institutes
- Delete users
- User status

#### **services/api.ts**
Centralized API client.

**Key Components:**

1. **Axios Instance Configuration**
   ```typescript
   - Base URL: http://localhost:5000/api
   - JSON content type
   - Request/response interceptors
   ```

2. **Request Interceptor**
   - Reads user from localStorage
   - Adds authentication headers:
     - `x-user-id`
     - `x-user-role`
     - `x-candidate-id` (if student)
     - `x-institute-code` (if institute)

3. **Response Interceptor**
   - Handles 401 Unauthorized errors
   - Clears localStorage
   - Redirects to login

4. **API Modules**
   - `authAPI` - Authentication endpoints
   - `candidateAPI` - Candidate management
   - `instituteAPI` - Institute management
   - `programAPI` - Program management
   - `choiceAPI` - Choice filling
   - `allocationAPI` - Allocations
   - `seatMatrixAPI` - Seat matrix
   - `openingClosingRanksAPI` - Rank data
   - `counsellingRoundAPI` - Round information

**Example Usage:**
```typescript
const response = await candidateAPI.getById(123);
const candidates = response.data;
```

#### **utils/auth.ts**
Authentication utility functions.

**Functions:**

1. **getCurrentUser()** - Get logged-in user from localStorage
   ```typescript
   Returns: User | null
   ```

2. **isAuthenticated()** - Check if user is logged in
   ```typescript
   Returns: boolean
   ```

3. **hasRole(role)** - Check if user has specific role
   ```typescript
   Returns: boolean
   ```

4. **isStudent()** - Check if user is student
   ```typescript
   Returns: boolean
   ```

5. **isInstitute()** - Check if user is institute
   ```typescript
   Returns: boolean
   ```

6. **isAdmin()** - Check if user is administrator
   ```typescript
   Returns: boolean
   ```

7. **saveUser(user)** - Save user to localStorage
   ```typescript
   Stores user object and sets isAuthenticated flag
   ```

8. **clearUser()** - Clear authentication data
   ```typescript
   Removes user and isAuthenticated from localStorage
   ```

**User Interface:**
```typescript
interface User {
  userID: number;
  username: string;
  role: 'Student' | 'Institute' | 'Administrator';
  email: string;
  candidateID?: number;
  instituteCode?: string;
  studentName?: string;
  instituteName?: string;
  // ... other fields
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**
   ```
   User fills form → Frontend validates → POST /api/auth/register
   → Backend creates Candidate/Institute record
   → Backend creates User record with hashed password
   → Transaction committed
   → Success response
   ```

2. **Login**
   ```
   User enters credentials → POST /api/auth/login
   → Backend finds user by email/username
   → Backend verifies password with bcrypt
   → Backend returns user profile
   → Frontend stores in localStorage
   → Frontend redirects to appropriate dashboard
   ```

3. **Protected Route Access**
   ```
   User makes API request → Frontend adds auth headers
   → Backend middleware checks headers
   → Backend attaches user to req.user
   → Backend checks role permissions
   → Controller executes if authorized
   → Response sent to frontend
   ```

### Role-Based Access Control (RBAC)

#### Student Role
**Can Access:**
- Own profile
- Own choice list
- Own allocations
- Public data (seat matrix, ranks, institutes)

**Cannot Access:**
- Other students' data
- Institute management
- Admin functions

#### Institute Role
**Can Access:**
- Own institute information
- Own programs
- Students allocated to their institute
- Public data

**Cannot Access:**
- Other institutes' data
- Candidate personal information
- Admin functions

#### Administrator Role
**Can Access:**
- All system data
- User management
- All CRUD operations
- System configuration
- Allocation algorithm execution

**Full Control Over:**
- Candidates
- Institutes
- Programs
- Allocations
- Users
- Counselling rounds

### Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds (10)
   - Minimum 6 characters
   - Never stored in plain text

2. **SQL Injection Prevention**
   - Parameterized queries using mysql2
   - No string concatenation in SQL

3. **Authorization**
   - Header-based authentication (x-user-id, x-user-role)
   - Middleware validation on every protected route
   - Role-based access control

4. **Data Isolation**
   - Students see only their data
   - Institutes see only their data
   - Admins see everything

5. **Error Handling**
   - No sensitive information in error messages
   - Database errors masked in production
   - Proper HTTP status codes

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | User login |
| POST | `/logout` | Authenticated | User logout |
| GET | `/profile/:userID` | Own/Admin | Get user profile |
| PUT | `/profile/:userID` | Own/Admin | Update profile |
| PUT | `/password/:userID` | Own | Change password |
| GET | `/check` | Public | Check identifier availability |
| GET | `/users` | Admin | List all users |
| DELETE | `/users/:userId` | Admin | Delete user |

### Candidate Routes (`/api/candidates`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | List all candidates |
| GET | `/:id` | Own/Admin | Get candidate details |
| POST | `/` | Admin | Create candidate |
| PUT | `/:id` | Own/Admin | Update candidate |
| DELETE | `/:id` | Admin | Delete candidate |
| GET | `/:id/allocations` | Own/Admin | Get allocations |

### Institute Routes (`/api/institutes`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | All | List all institutes |
| GET | `/:code` | All | Get institute details |
| POST | `/` | Admin | Create institute |
| PUT | `/:code` | Own/Admin | Update institute |
| DELETE | `/:code` | Admin | Delete institute |
| GET | `/:code/programs` | All | Get programs |

### Choice Routes (`/api/choices`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/candidate/:id` | Own/Admin | Get choices |
| POST | `/` | Student | Save choices |
| DELETE | `/:id` | Own/Admin | Delete choice |
| PUT | `/lock/:candidateId` | Own | Lock choices |
| PUT | `/unlock/:candidateId` | Own | Unlock choices |

### Allocation Routes (`/api/allocations`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | List all allocations |
| GET | `/candidate/:id` | Own/Admin | Get by candidate |
| GET | `/institute/:code` | Institute/Admin | Get by institute |
| POST | `/` | Admin | Create allocation |
| PUT | `/:id` | Admin | Update allocation |
| DELETE | `/:id` | Admin | Delete allocation |

### Common/Public Routes (`/api`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/programs` | All | List all programs |
| GET | `/seat-matrix` | All | Get seat matrix |
| GET | `/opening-closing-ranks` | All | Get rank cutoffs |
| GET | `/counselling-rounds` | All | Get round info |

---

## 🔄 Data Flow

### 1. Student Registration Flow
```
Frontend (Register.tsx)
    ↓ User submits form
    ↓ POST /api/auth/register
Backend (authController.js)
    ↓ Validates data
    ↓ Calls User.registerStudent()
Database (User.js model)
    ↓ BEGIN TRANSACTION
    ↓ INSERT INTO Candidate
    ↓ INSERT INTO Users (with hashed password)
    ↓ COMMIT TRANSACTION
    ↓ Returns userID
Backend
    ↓ Returns success response
Frontend
    ↓ Stores user in localStorage
    ↓ Redirects to login/home
```

### 2. Choice Filling Flow
```
Frontend (ChoiceFilling.tsx)
    ↓ Student searches programs
    ↓ GET /api/programs (filters)
Backend (commonController.js)
    ↓ Program.getAll(filters)
Database
    ↓ SELECT with JOINs
    ↓ Returns program list
Frontend
    ↓ Displays programs
    ↓ Student adds to choices
    ↓ Reorders priorities
    ↓ POST /api/choices
Backend (choiceController.js)
    ↓ Validates candidateID
    ↓ ChoiceList.saveChoices()
Database
    ↓ BEGIN TRANSACTION
    ↓ DELETE old choices
    ↓ INSERT new choices
    ↓ COMMIT TRANSACTION
Frontend
    ↓ Shows success message
    ↓ Updates UI
```

### 3. Seat Allocation Flow (Admin)
```
Admin Dashboard (AdminDashboard.tsx)
    ↓ Clicks "Run Allocation"
    ↓ POST /api/allocations/run
Backend (allocationController.js)
    ↓ Gets current round
    ↓ Gets all locked choices
    ↓ Gets seat matrix
    ↓ Runs allocation algorithm:
        - Sort candidates by rank
        - For each candidate:
            - Check each choice in order
            - If seat available in matching category
                - Allocate seat
                - Decrement available seats
                - Break loop
Database (Allocation.js)
    ↓ BEGIN TRANSACTION
    ↓ INSERT allocations
    ↓ UPDATE seat matrix
    ↓ COMMIT TRANSACTION
Backend
    ↓ Returns allocation results
Frontend
    ↓ Shows results
    ↓ Refreshes allocations page
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+ 
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd DBMS_Project
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE DBMS_TermProject;
USE DBMS_TermProject;

# Import schema
source DBMS_TermProject.sql;

# (Optional) Import sample data
source insert_sample_data.sql;

# (Optional) Setup authentication system
source authentication.sql;

# Exit MySQL
exit
```

### 3. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=DBMS_TermProject
NODE_ENV=development
EOF

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Default Admin Account
After running `authentication.sql`:
- **Email:** admin@josaa.in
- **Password:** admin123
- **Role:** Administrator

---

## 📝 SQL Files Explained

### **DBMS_TermProject.sql**
Complete database schema with all tables:
- Table structure definitions
- Primary keys, foreign keys, indexes
- Constraints and relationships
- Empty tables ready for data

### **insert_sample_data.sql**
Sample data for testing:
- Sample institutes (IITs, NITs)
- Sample programs (B.Tech branches)
- Sample candidates
- Sample seat matrix
- Sample opening/closing ranks
- Useful for development and testing

### **authentication.sql**
Authentication system setup:
- Creates Users table
- Adds admin account
- Sets up login system
- Links users to candidates/institutes

---

## 🏗️ Development Workflow

### Adding a New Feature

1. **Database Changes**
   - Update schema in SQL file
   - Run migration on database

2. **Backend**
   - Create/update model in `models/`
   - Add controller logic in `controllers/`
   - Define routes in `routes/`
   - Add middleware if needed

3. **Frontend**
   - Add API functions in `services/api.ts`
   - Create/update page component in `pages/`
   - Update routing in `App.tsx`
   - Add navigation link in `Header.tsx`

### Running in Development

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

---

## 🐛 Common Issues & Solutions

### Database Connection Failed
- Check MySQL service is running
- Verify credentials in `.env`
- Check database exists

### CORS Errors
- Verify backend CORS configuration
- Check API base URL in frontend
- Ensure ports match

### Authentication Not Working
- Clear browser localStorage
- Check headers in API calls
- Verify middleware is applied to routes

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

---

## 📚 Additional Resources

- **React Documentation:** https://react.dev
- **Express Documentation:** https://expressjs.com
- **MySQL Documentation:** https://dev.mysql.com/doc/
- **Vite Documentation:** https://vite.dev
- **Axios Documentation:** https://axios-http.com

---

## 🤝 Contributing

See `CONTRIBUTING.md` for contribution guidelines.

---

## 📄 License

This project is created for educational purposes as part of a DBMS term project.

---

**Last Updated:** November 14, 2025

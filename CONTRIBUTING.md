# Contributing to JoSAA Counselling System

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Quick Start for Contributors

### 1. Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/ks-iitjmu/DBMS_Project.git
cd DBMS_Project

# Setup database
mysql -u root -p jossaDATABASE < DBMS_TermProject.sql
mysql -u root -p jossaDATABASE < authentication.sql
mysql -u root -p jossaDATABASE < insert_sample_data.sql

# Backend setup
cd server
npm install
cp .env.example .env  # Edit with your MySQL credentials
npm start

# Frontend setup (in new terminal)
cd client
npm install
npm run dev
```

### 2. Understanding the Architecture

#### Backend Structure
```
server/
├── middleware/auth.js          # Authentication & authorization
├── controllers/                # Request handlers with role checks
├── models/                     # Database queries
└── routes/                     # API endpoints with middleware
```

**Key Concept:** All protected routes use authentication middleware that checks user headers.

#### Frontend Structure
```
client/src/
├── utils/auth.ts              # Authentication utilities
├── services/api.ts            # API client with auto-auth headers
├── pages/                     # Page components with role checks
└── components/Header.tsx      # Navigation with conditional rendering
```

**Key Concept:** User data is stored in localStorage and automatically included in all API requests.

## 🔐 Authentication System Overview

### How It Works

1. **User logs in** → Server validates credentials
2. **Server returns user data** → Client stores in localStorage
3. **Every API request** → Client adds auth headers automatically
4. **Server checks headers** → Validates role and permissions
5. **Access granted/denied** → Based on user role

### Authentication Headers (Automatic)
```javascript
{
  'x-user-id': userID,
  'x-user-role': 'Student' | 'Institute' | 'Administrator',
  'x-candidate-id': candidateID,      // for students
  'x-institute-code': instituteCode   // for institutes
}
```

### Role-Based Access

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| **Public** | Seat Matrix, Ranks, Institutes | Candidates, Allocations, Choices |
| **Student** | Own profile, Own allocations, Own choices | Other students' data, Admin functions |
| **Institute** | Own institute data | Student data, Other institutes' data |
| **Admin** | Everything | - |

## 🛠️ Common Development Tasks

### Adding a New Protected Route

1. **Create Controller** (`server/controllers/yourController.js`):
```javascript
exports.yourFunction = async (req, res) => {
  try {
    const { userID, role, candidateID } = req.user; // Available from middleware
    
    // Role-based logic
    if (role === 'Student') {
      // Student-specific logic
      // Ensure students only access their own data
      if (candidateID !== parseInt(req.params.id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }
    
    // Your logic here
    const data = await YourModel.getData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

2. **Add Route** (`server/routes/yourRoute.js`):
```javascript
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Require authentication
router.get('/protected', isAuthenticated, yourController.yourFunction);

// Require specific role
router.post('/admin-only', isAuthenticated, hasRole('Administrator'), yourController.adminFunction);

// Public route (no middleware)
router.get('/public', yourController.publicFunction);
```

3. **Add Frontend API** (`client/src/services/api.ts`):
```typescript
export const yourAPI = {
  getData: () => api.get('/your-route'),
  createData: (data: any) => api.post('/your-route', data)
};
```

### Adding a Student-Only Page

1. **Create Page** (`client/src/pages/YourPage.tsx`):
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isStudent, getCurrentUser } from '../utils/auth';

const YourPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is a student
    if (!isAuthenticated() || !isStudent()) {
      alert('This page is only for students');
      navigate('/login');
      return;
    }
    
    // Get current user data
    const user = getCurrentUser();
    console.log('Student ID:', user?.candidateID);
  }, [navigate]);
  
  return <div>Your Student-Only Content</div>;
};
```

2. **Add Route** (`client/src/App.tsx`):
```typescript
<Route path="/your-page" element={<YourPage />} />
```

3. **Add Navigation** (`client/src/components/Header.tsx`) - Only for students:
```tsx
{isAuth && user?.role === 'Student' && (
  <Link to="/your-page" className={`nav-link ${isActive('/your-page')}`}>
    Your Page
  </Link>
)}
```

### Checking User Roles

#### Backend (in controllers):
```javascript
if (req.user.role === 'Student') { /* Student logic */ }
if (req.user.role === 'Institute') { /* Institute logic */ }
if (req.user.role === 'Administrator') { /* Admin logic */ }
```

#### Frontend (in components):
```typescript
import { isStudent, isInstitute, isAdmin, getCurrentUser } from '../utils/auth';

if (isStudent()) { /* Show student UI */ }
if (isInstitute()) { /* Show institute UI */ }
if (isAdmin()) { /* Show admin UI */ }

const user = getCurrentUser(); // Get full user object
```

## 🧪 Testing Your Changes

### 1. Test Authentication Flow
```bash
# Test protected route without auth (should fail)
curl http://localhost:5000/api/candidates
# Expected: 401 Unauthorized

# Test public route (should work)
curl http://localhost:5000/api/seat-matrix
# Expected: 200 OK with data
```

### 2. Test Role-Based Access

**As Student:**
- Login with student credentials
- Verify you can only access your own data
- Try accessing another student's data (should be denied)
- Verify "Choice Filling" appears in menu

**As Institute:**
- Login with institute credentials
- Verify you can edit your institute
- Try editing another institute (should be denied)
- Verify "Choice Filling" does NOT appear

**As Admin:**
- Login with admin credentials
- Verify full access to all data
- Verify all CRUD operations work

### 3. Run Automated Tests
```bash
./test-auth.sh
```

## 📝 Code Style Guidelines

### Backend (JavaScript)
```javascript
// Use async/await
exports.getData = async (req, res) => {
  try {
    const data = await Model.fetch();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Always check user permissions
if (!req.user || req.user.role !== 'Student') {
  return res.status(403).json({ success: false, message: 'Access denied' });
}

// Use parameterized queries (prevent SQL injection)
const query = 'SELECT * FROM Candidates WHERE CandidateID = ?';
const [rows] = await pool.execute(query, [candidateId]);
```

### Frontend (TypeScript)
```typescript
// Type your props
interface Props {
  candidateId: number;
  onUpdate: (data: any) => void;
}

// Use functional components
const MyComponent: React.FC<Props> = ({ candidateId, onUpdate }) => {
  // Component logic
};

// Handle errors
try {
  const response = await api.getData();
  if (response.data.success) {
    // Handle success
  }
} catch (error: any) {
  if (error.response?.status === 401) {
    navigate('/login');
  } else {
    alert(error.response?.data?.message || 'An error occurred');
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: Headers not being sent
**Solution:** Check that user data exists in localStorage:
```javascript
const user = localStorage.getItem('user');
console.log('User data:', user);
```

### Issue: Student sees all candidates instead of only their profile
**Solution:** Check controller has role-based filtering:
```javascript
if (req.user.role === 'Student') {
  // Fetch only this student's data
  candidateId = req.user.candidateID;
}
```

### Issue: Navigation menu doesn't hide Choice Filling for non-students
**Solution:** Check Header.tsx has conditional rendering:
```tsx
{isAuth && user?.role === 'Student' && (
  <Link to="/choice-filling">Choice Filling</Link>
)}
```

## 📚 Useful Resources

- **API Testing:** Use Postman or curl for API testing
- **Database:** MySQL Workbench for viewing database
- **React DevTools:** Browser extension for debugging React
- **Network Tab:** Browser DevTools to inspect API requests/responses

## 🤝 Contribution Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write clean, documented code
   - Test thoroughly with different roles
   - Ensure no security vulnerabilities

3. **Test authentication**
   - Test as public user (no login)
   - Test as student
   - Test as institute
   - Test as admin

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: clear description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe what you changed and why
   - List testing steps
   - Mention any breaking changes

## 📞 Getting Help

- **Read README.md** for complete documentation
- **Check server logs** for backend errors
- **Check browser console** for frontend errors
- **Review existing code** for patterns and examples

## ⚠️ Security Reminders

- ✅ Always validate user input
- ✅ Use parameterized SQL queries
- ✅ Check user roles before data access
- ✅ Never expose sensitive data in responses
- ✅ Log security-related events
- ✅ Test with different user roles
- ❌ Don't commit .env files
- ❌ Don't hardcode passwords
- ❌ Don't expose admin functions to students

---

**Happy Contributing! 🎉**

For questions or issues, create a GitHub issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, MySQL version)

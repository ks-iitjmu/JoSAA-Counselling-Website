# JoSAA Counselling System

A modern web-based seat allocation system for JEE counselling, built with React, TypeScript, Node.js, Express, and MySQL.

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
exit

# Import schema and data
mysql -u root -p jossaDATABASE < DBMS_TermProject.sql
mysql -u root -p jossaDATABASE < insert_sample_data.sql
```

### 2. Backend Setup
```bash
cd server
npm install

# Configure .env (already set up)
# DB_HOST=localhost, DB_USER=root, DB_PASSWORD=Josaa@2005, DB_NAME=jossaDATABASE

npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
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

- ✅ **Candidates** - View registered candidates with JEE ranks
- ✅ **Institutes** - Browse IITs, NITs, IIITs with search/filter
- ✅ **Choice Filling** - Manage program preferences
- ✅ **Allocations** - View seat allocation results by round
- ✅ **Seat Matrix** - Check available seats by category
- ✅ **Opening/Closing Ranks** - View cutoff ranks

## 🔧 Tech Stack

**Frontend:** React 19, TypeScript, React Router, Axios, Vite  
**Backend:** Node.js, Express 5, MySQL 8, mysql2  
**Design:** Material Design principles, responsive CSS

## 📡 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/candidates` | GET | All candidates |
| `/api/institutes` | GET | All institutes |
| `/api/choices/candidate/:id` | GET | Choices by candidate |
| `/api/allocations` | GET | All allocations |
| `/api/seat-matrix` | GET | Seat availability |
| `/api/opening-closing-ranks` | GET | Cutoff ranks |

**Full API docs:** See server routes in `server/routes/`

## 🗄️ Database Schema

**Main Tables:**
- `Candidate` - Student information with JEE ranks
- `Institute` - IIT/NIT/IIIT details
- `Program` - Academic programs
- `Institute_Program` - Institute-program mapping
- `Choice_List` - Candidate preferences
- `Allocation` - Seat allocation results
- `Seat_Matrix` - Available seats by category
- `Opening_Closing_Ranks` - Cutoff data
- `Counselling_Round` - Round schedules

## 📝 Notes

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- Sample data includes 5 institutes, 8 programs, 5 candidates
- Database password in this project: `Josaa@2005`

## 👥 Project

DBMS Term Project - JoSAA Seat Allocation System

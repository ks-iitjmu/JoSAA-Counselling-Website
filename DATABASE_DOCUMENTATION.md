# JoSAA Database Schema Documentation

## 📊 Database Overview

**Database Name:** `DBMS_TermProject`  
**Database Engine:** MySQL 8.0.43  
**Character Set:** utf8mb4  
**Collation:** utf8mb4_0900_ai_ci  
**Storage Engine:** InnoDB

This database models the **Joint Seat Allocation Authority (JoSAA)** system for managing the counselling process of engineering college admissions through JEE (Joint Entrance Examination).

---

## 🎯 Database Purpose

The database is designed to handle:
1. **Student/Candidate Management** - Store applicant information and JEE ranks
2. **Institute Management** - Manage participating colleges (IITs, NITs, IIITs, GFTIs)
3. **Program Management** - Academic programs offered by institutes
4. **Choice Filling** - Students' preference list of institute-program combinations
5. **Seat Allocation** - Automated allocation based on ranks and choices
6. **Seat Matrix** - Available seats by category, quota, and seat pool
7. **Opening/Closing Ranks** - Historical rank cutoffs for programs
8. **Counselling Rounds** - Multiple rounds of admission process

---

## 📋 Table of Contents

1. [Entity Relationship Overview](#entity-relationship-overview)
2. [Table Descriptions](#table-descriptions)
   - [Candidate](#1-candidate-table)
   - [Institute](#2-institute-table)
   - [Program](#3-program-table)
   - [Institute_Program](#4-institute_program-table)
   - [Choice_List](#5-choice_list-table)
   - [Counselling_Round](#6-counselling_round-table)
   - [Seat_Matrix](#7-seat_matrix-table)
   - [Allocation](#8-allocation-table)
   - [Opening_Closing_Ranks](#9-opening_closing_ranks-table)
3. [Relationships & Constraints](#relationships--constraints)
4. [Business Logic & Rules](#business-logic--rules)
5. [Data Integrity](#data-integrity)
6. [Common Queries](#common-queries)
7. [Glossary](#glossary)

---

## 🔗 Entity Relationship Overview

```
┌──────────────┐         ┌─────────────┐         ┌──────────────┐
│  Candidate   │         │  Institute  │         │   Program    │
│  (Student)   │         │  (College)  │         │   (Course)   │
└──────┬───────┘         └──────┬──────┘         └──────┬───────┘
       │                        │                        │
       │                        └────────┬───────────────┘
       │                                 │
       │                         ┌───────▼───────────┐
       │                         │ Institute_Program │
       │                         │  (Many-to-Many)   │
       │                         └───────┬───────────┘
       │                                 │
       ├─────────────────────────────────┼──────────────┐
       │                                 │              │
┌──────▼───────┐                 ┌──────▼────────┐  ┌──▼─────────┐
│ Choice_List  │                 │  Seat_Matrix  │  │ Opening_   │
│ (Preferences)│                 │  (Available)  │  │ Closing_   │
└──────┬───────┘                 └───────────────┘  │ Ranks      │
       │                                            └────────────┘
       │         ┌────────────────────┐
       │         │ Counselling_Round  │
       │         │   (Round 1,2,3)    │
       │         └─────────┬──────────┘
       │                   │
       └───────┬───────────┘
               │
        ┌──────▼──────┐
        │ Allocation  │
        │  (Results)  │
        └─────────────┘
```

---

## 📚 Table Descriptions

### 1. Candidate Table

**Purpose:** Stores information about students/candidates who have qualified JEE and are eligible for counselling.

**Table Name:** `Candidate`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `CandidateID` | INT | PRIMARY KEY | Unique identifier for each candidate (often JEE Application Number) |
| `Name` | VARCHAR(255) | NULL | Full name of the candidate |
| `DateOfBirth` | DATE | NULL | Candidate's date of birth |
| `Gender` | VARCHAR(50) | NULL | Gender (Male/Female/Other) |
| `MobileNumber` | VARCHAR(15) | NULL | Contact mobile number |
| `EmailAddress` | VARCHAR(255) | NULL | Email address for communication |
| `JEE_Mains_Application_Number` | VARCHAR(50) | NULL | JEE Mains registration number |
| `JEE_Advanced_Application_Number` | VARCHAR(50) | NULL | JEE Advanced registration number (if qualified) |
| `StateOfEligibility` | VARCHAR(100) | NULL | State for home state quota consideration |
| `JEE_Mains_AIR` | INT | NULL | All India Rank in JEE Mains |
| `JEE_Mains_Category_Rank` | INT | NULL | Category-wise rank (if applicable) |
| `JEE_Advanced_Qualifying_status` | VARCHAR(50) | NULL | Whether candidate qualified JEE Advanced (Yes/No) |
| `Category` | VARCHAR(50) | NULL | Reservation category (OPEN/OBC/SC/ST/EWS) |
| `PwD_status` | VARCHAR(50) | NULL | Person with Disability status (Yes/No) |
| `PwD_Category` | VARCHAR(50) | NULL | Type of disability if PwD_status is Yes |
| `DS_Status` | VARCHAR(50) | NULL | Defence Service quota eligibility (Yes/No) |
| `Twelfth_Aggregate_Percentage` | DECIMAL(5,2) | NULL | 12th standard percentage |
| `Twelfth_Top_20_Percentile_Status` | VARCHAR(50) | NULL | Whether in top 20 percentile of board |
| `Document_Upload_Status` | VARCHAR(50) | NULL | Status of required document uploads (Complete/Incomplete) |

**Key Points:**
- Primary key is `CandidateID` which uniquely identifies each student
- JEE_Mains_AIR is crucial for seat allocation algorithm
- Category determines which seat pools the candidate is eligible for
- State of eligibility is used for Home State (HS) quota calculation

**Sample Data:**
```sql
CandidateID: 10001
Name: Rajesh Kumar
JEE_Mains_AIR: 1250
Category: OBC
StateOfEligibility: Delhi
```

---

### 2. Institute Table

**Purpose:** Stores information about participating educational institutions (IITs, NITs, IIITs, GFTIs).

**Table Name:** `Institute`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `InstituteCode` | VARCHAR(20) | PRIMARY KEY | Unique code for institute (e.g., IIT001, NIT001) |
| `InstituteName` | VARCHAR(255) | NULL | Full name of the institute |
| `InstituteType` | VARCHAR(100) | NULL | Type: IIT/NIT/IIIT/GFTI |
| `MailingAddress` | TEXT | NULL | Complete postal address |
| `Phone` | VARCHAR(20) | NULL | Contact phone number |
| `Website` | VARCHAR(255) | NULL | Official website URL |

**Key Points:**
- InstituteCode is the primary key (e.g., "IITB" for IIT Bombay, "NITD" for NIT Delhi)
- InstituteType helps in categorizing institutes for reporting
- Website and phone are for candidate reference

**Sample Data:**
```sql
InstituteCode: IITB
InstituteName: Indian Institute of Technology Bombay
InstituteType: IIT
MailingAddress: Powai, Mumbai, Maharashtra - 400076
Phone: 022-25722545
Website: https://www.iitb.ac.in
```

---

### 3. Program Table

**Purpose:** Defines academic programs/courses offered across all institutes.

**Table Name:** `Program`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `ProgramCode` | VARCHAR(20) | PRIMARY KEY | Unique code for program (e.g., CSE, EE, ME) |
| `ProgramName` | VARCHAR(255) | NULL | Full program name |
| `Duration_years` | INT | NULL | Duration of the program in years |
| `Degree_Type` | VARCHAR(50) | NULL | Type of degree (B.Tech/B.Arch/B.S./etc.) |

**Key Points:**
- ProgramCode is standardized across all institutes
- Same program code is used for same branch across different institutes
- Duration is typically 4 or 5 years for undergraduate programs

**Sample Data:**
```sql
ProgramCode: CSE
ProgramName: Computer Science and Engineering
Duration_years: 4
Degree_Type: B.Tech

ProgramCode: EE
ProgramName: Electrical Engineering
Duration_years: 4
Degree_Type: B.Tech

ProgramCode: ARCH
ProgramName: Architecture
Duration_years: 5
Degree_Type: B.Arch
```

---

### 4. Institute_Program Table

**Purpose:** Junction table establishing many-to-many relationship between institutes and programs. Not all institutes offer all programs.

**Table Name:** `Institute_Program`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `InstituteCode` | VARCHAR(20) | PRIMARY KEY, FOREIGN KEY | References Institute |
| `ProgramCode` | VARCHAR(20) | PRIMARY KEY, FOREIGN KEY | References Program |

**Composite Primary Key:** (`InstituteCode`, `ProgramCode`)

**Foreign Keys:**
- `InstituteCode` → `Institute(InstituteCode)`
- `ProgramCode` → `Program(ProgramCode)`

**Key Points:**
- Represents which programs are offered by which institutes
- A program entry exists only if the institute offers that program
- Essential for validating candidate choices

**Sample Data:**
```sql
(IITB, CSE)   -- IIT Bombay offers Computer Science
(IITB, EE)    -- IIT Bombay offers Electrical Engineering
(IITD, CSE)   -- IIT Delhi offers Computer Science
(NITD, ME)    -- NIT Delhi offers Mechanical Engineering
```

---

### 5. Choice_List Table

**Purpose:** Stores candidates' preferred choices of institute-program combinations in priority order.

**Table Name:** `Choice_List`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `ChoiceID` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each choice entry |
| `CandidateID` | INT | FOREIGN KEY, NOT NULL | References the candidate |
| `ChoiceNumber` | INT | NOT NULL | Priority order (1, 2, 3, ...) |
| `InstituteCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Preferred institute |
| `ProgramCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Preferred program |
| `Lock_Status` | TINYINT(1) | DEFAULT 0 | Whether choice is locked (0=No, 1=Yes) |

**Constraints:**
- UNIQUE constraint on (`CandidateID`, `ChoiceNumber`) - Each candidate can have only one choice at each priority level
- Foreign key to Candidate table
- Foreign key to Institute_Program table (composite)

**Key Points:**
- ChoiceNumber indicates preference order: 1 is highest priority
- Lock_Status = 1 means candidate has finalized choices (no more changes allowed)
- Candidates can fill up to a specified number of choices (commonly 100-200)
- Used by allocation algorithm to assign seats

**Sample Data:**
```sql
ChoiceID: 1
CandidateID: 10001
ChoiceNumber: 1
InstituteCode: IITB
ProgramCode: CSE
Lock_Status: 1

ChoiceID: 2
CandidateID: 10001
ChoiceNumber: 2
InstituteCode: IITD
ProgramCode: CSE
Lock_Status: 1
```

---

### 6. Counselling_Round Table

**Purpose:** Defines different rounds of counselling process (typically 4-6 rounds per year).

**Table Name:** `Counselling_Round`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `RoundID` | INT | PRIMARY KEY | Unique identifier for each round (1, 2, 3...) |
| `StartDate` | DATE | NOT NULL | Round start date |
| `EndDate` | DATE | NOT NULL | Round end date |

**Key Points:**
- Each counselling year typically has 4-6 rounds
- Candidates can modify choices between rounds
- Seat allocations happen at the end of each round
- StartDate and EndDate define when candidates can participate

**Sample Data:**
```sql
RoundID: 1
StartDate: 2025-06-15
EndDate: 2025-06-25

RoundID: 2
StartDate: 2025-06-28
EndDate: 2025-07-05
```

---

### 7. Seat_Matrix Table

**Purpose:** Defines total available seats for each institute-program combination, categorized by seat pool, quota, and reservation category.

**Table Name:** `Seat_Matrix`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `SeatMatrixID` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `InstituteCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Institute offering the seats |
| `ProgramCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Program for which seats are available |
| `SeatPool` | VARCHAR(50) | NOT NULL | Gender-Neutral or Female-Only |
| `Quota` | VARCHAR(50) | NOT NULL | AI (All India), HS (Home State), OS (Other State), etc. |
| `Category` | VARCHAR(50) | NOT NULL | OPEN, OBC-NCL, SC, ST, EWS, etc. |
| `TotalSeats` | INT | CHECK >= 0 | Total number of seats |

**Constraints:**
- UNIQUE constraint on (`InstituteCode`, `ProgramCode`, `SeatPool`, `Quota`, `Category`)
- Foreign key to Institute_Program (composite)
- CHECK constraint: TotalSeats must be >= 0

**Key Points:**
- Each row represents a specific combination of seats
- **SeatPool:** Gender-Neutral (for all), Female-Only (reserved for female candidates)
- **Quota:** 
  - AI (All India) - Open to all states
  - HS (Home State) - Reserved for students of that state
  - OS (Other State) - For other states
  - GO (Goa quota), LA (Ladakh quota), JK (Jammu & Kashmir), etc.
- **Category:** Reservation based on social/economic status
  - OPEN: General category
  - OBC-NCL: Other Backward Classes - Non-Creamy Layer
  - SC: Scheduled Caste
  - ST: Scheduled Tribe
  - EWS: Economically Weaker Section
  - PwD: Person with Disability sub-quotas

**Sample Data:**
```sql
SeatMatrixID: 1
InstituteCode: IITB
ProgramCode: CSE
SeatPool: Gender-Neutral
Quota: AI
Category: OPEN
TotalSeats: 30

SeatMatrixID: 2
InstituteCode: IITB
ProgramCode: CSE
SeatPool: Female-Only
Quota: AI
Category: OPEN
TotalSeats: 5

SeatMatrixID: 3
InstituteCode: IITB
ProgramCode: CSE
SeatPool: Gender-Neutral
Quota: AI
Category: OBC-NCL
TotalSeats: 20
```

**Example Breakdown:**
For IIT Bombay CSE, if total seats = 100:
- Gender-Neutral OPEN AI: 30
- Gender-Neutral OBC AI: 20
- Gender-Neutral SC AI: 10
- Gender-Neutral ST AI: 8
- Female-Only OPEN AI: 5
- And so on for HS, OS quotas and other categories...

---

### 8. Allocation Table

**Purpose:** Records the final seat allocation results after each counselling round.

**Table Name:** `Allocation`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `AllocationID` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique allocation identifier |
| `CandidateID` | INT | FOREIGN KEY, NOT NULL | Student who got allocated |
| `RoundID` | INT | FOREIGN KEY, NOT NULL | In which round allocation happened |
| `AllocatedInstituteCode` | VARCHAR(20) | FOREIGN KEY, NULL | Allocated institute |
| `AllocatedProgramCode` | VARCHAR(20) | FOREIGN KEY, NULL | Allocated program |
| `Action` | VARCHAR(100) | NULL | Candidate's response to allocation |
| `Fee_Payment_Status` | VARCHAR(50) | DEFAULT 'Pending' | Payment status |
| `Allocation_Timestamp` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When allocation was made |

**Foreign Keys:**
- `CandidateID` → `Candidate(CandidateID)`
- `RoundID` → `Counselling_Round(RoundID)`
- (`AllocatedInstituteCode`, `AllocatedProgramCode`) → `Institute_Program`

**Key Points:**
- Records allocation history for each candidate across rounds
- A candidate can have multiple allocation records (one per round if allocated)
- **Action** can be:
  - **Freeze:** Accept allocation, stop participating in future rounds
  - **Float:** Accept allocation but keep participating for upgrades
  - **Slide:** Accept allocation within institute but allow program upgrades
  - **Withdraw:** Reject allocation and exit counselling
- **Fee_Payment_Status:** Tracks whether candidate paid admission fee
  - Pending
  - Paid
  - Not Required
  - Refunded

**Sample Data:**
```sql
AllocationID: 1
CandidateID: 10001
RoundID: 1
AllocatedInstituteCode: NITD
AllocatedProgramCode: CSE
Action: Float
Fee_Payment_Status: Paid
Allocation_Timestamp: 2025-06-26 10:30:00

AllocationID: 2
CandidateID: 10001
RoundID: 2
AllocatedInstituteCode: IITD
AllocatedProgramCode: CSE
Action: Freeze
Fee_Payment_Status: Paid
Allocation_Timestamp: 2025-07-06 11:45:00
```

**Interpretation:**
- Candidate 10001 got NIT Delhi CSE in Round 1, chose to Float (keep trying for better)
- In Round 2, got upgraded to IIT Delhi CSE, chose to Freeze (accept and stop)

---

### 9. Opening_Closing_Ranks Table

**Purpose:** Stores historical data of opening and closing ranks for each institute-program combination. Helps candidates make informed choices.

**Table Name:** `Opening_Closing_Ranks`

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `OCR_ID` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `RoundID` | INT | FOREIGN KEY, NOT NULL | Counselling round |
| `InstituteCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Institute |
| `ProgramCode` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Program |
| `SeatPool` | VARCHAR(50) | NOT NULL | Gender-Neutral or Female-Only |
| `Quota` | VARCHAR(50) | NOT NULL | AI/HS/OS/etc. |
| `Category` | VARCHAR(50) | NOT NULL | OPEN/OBC/SC/ST/EWS |
| `OpeningRank` | INT | NULL | Best rank that got admission |
| `ClosingRank` | INT | NULL | Last rank that got admission |

**Foreign Keys:**
- `RoundID` → `Counselling_Round(RoundID)`
- (`InstituteCode`, `ProgramCode`) → `Institute_Program`

**Key Points:**
- **Opening Rank:** The highest rank (numerically lowest, i.e., best rank) that got admission
- **Closing Rank:** The lowest rank (numerically highest) that got admission
- These ranks are calculated after seat allocation is complete
- Helps candidates predict their chances in future rounds/years
- Same institute-program can have different cutoffs for different seat pools, quotas, and categories

**Sample Data:**
```sql
OCR_ID: 1
RoundID: 6 (Final Round)
InstituteCode: IITB
ProgramCode: CSE
SeatPool: Gender-Neutral
Quota: AI
Category: OPEN
OpeningRank: 1
ClosingRank: 120

OCR_ID: 2
RoundID: 6
InstituteCode: IITB
ProgramCode: CSE
SeatPool: Gender-Neutral
Quota: AI
Category: OBC-NCL
OpeningRank: 150
ClosingRank: 480
```

**Interpretation:**
- For IIT Bombay CSE (Gender-Neutral, All India, OPEN category):
  - Rank 1 student got admitted (opening rank)
  - Rank 120 was the last rank that got the seat (closing rank)
  - If your rank is between 1-120, you have a chance
- For the same program but OBC category:
  - Ranks between 150-480 got admitted

---

## 🔗 Relationships & Constraints

### Primary Keys
- **Candidate:** `CandidateID`
- **Institute:** `InstituteCode`
- **Program:** `ProgramCode`
- **Institute_Program:** Composite (`InstituteCode`, `ProgramCode`)
- **Choice_List:** `ChoiceID`
- **Counselling_Round:** `RoundID`
- **Seat_Matrix:** `SeatMatrixID`
- **Allocation:** `AllocationID`
- **Opening_Closing_Ranks:** `OCR_ID`

### Foreign Key Relationships

```
Allocation
  ├─→ CandidateID → Candidate(CandidateID)
  ├─→ RoundID → Counselling_Round(RoundID)
  └─→ (AllocatedInstituteCode, AllocatedProgramCode) → Institute_Program

Choice_List
  ├─→ CandidateID → Candidate(CandidateID)
  └─→ (InstituteCode, ProgramCode) → Institute_Program

Institute_Program
  ├─→ InstituteCode → Institute(InstituteCode)
  └─→ ProgramCode → Program(ProgramCode)

Opening_Closing_Ranks
  ├─→ RoundID → Counselling_Round(RoundID)
  └─→ (InstituteCode, ProgramCode) → Institute_Program

Seat_Matrix
  └─→ (InstituteCode, ProgramCode) → Institute_Program
```

### Unique Constraints
1. **Choice_List:** (`CandidateID`, `ChoiceNumber`) - One choice per priority level per candidate
2. **Seat_Matrix:** (`InstituteCode`, `ProgramCode`, `SeatPool`, `Quota`, `Category`) - One seat count per combination

### Check Constraints
1. **Seat_Matrix:** `TotalSeats >= 0` - Cannot have negative seats

---

## 📐 Business Logic & Rules

### 1. Candidate Eligibility
- Must have valid JEE Mains rank
- Document upload must be complete
- Category and quota eligibility must match

### 2. Choice Filling Rules
- Candidates can fill multiple choices (typically 100-200)
- Choices are prioritized by `ChoiceNumber` (1 = highest priority)
- Once choices are locked (`Lock_Status = 1`), they cannot be modified in that round
- Can only choose institute-program combinations that exist in `Institute_Program`

### 3. Seat Allocation Algorithm
**Simplified Logic:**
```
1. Sort all candidates by rank (ascending - lower rank is better)
2. For each candidate in sorted order:
   a. Get their choice list ordered by ChoiceNumber
   b. For each choice:
      - Check if seat is available in matching:
        * Institute-Program
        * Candidate's category
        * Candidate's quota eligibility
        * Seat pool (gender-neutral or female-only if female)
      - If seat available:
        * Allocate seat to candidate
        * Decrement available seats in that category
        * Record in Allocation table
        * Break (stop checking further choices)
   c. If no choice matched, candidate remains unallocated
3. Calculate opening and closing ranks for each program
```

### 4. Actions After Allocation
- **Freeze:** Accept seat, pay fee, stop participating in future rounds
- **Float:** Accept seat, pay fee, continue for possible upgrades
- **Slide:** Accept allocation, continue for program upgrades within same institute
- **Withdraw:** Reject allocation, exit counselling, seat becomes available

### 5. Opening/Closing Rank Calculation
```
For each Institute-Program-Category-Quota-SeatPool combination:
  OpeningRank = MIN(rank of all allocated candidates)
  ClosingRank = MAX(rank of all allocated candidates)
```

---

## 🛡️ Data Integrity

### Referential Integrity
- **ON DELETE:** Cascade or restrict based on business rules
  - Deleting an institute should not be allowed if it has allocations
  - Deleting a candidate should cascade to choices and allocations
  
### Data Validation
- Ranks must be positive integers
- Dates must be valid and in logical order
- Phone numbers and emails should follow standard formats
- Choice numbers should be sequential starting from 1

### Consistency Rules
- Total seats in Seat_Matrix should match institute capacity
- Allocated seats should not exceed available seats
- Opening rank should always be less than or equal to closing rank
- A candidate can have only one active allocation per round

---

## 🔍 Common Queries

### 1. Get All Choices for a Candidate
```sql
SELECT c.ChoiceNumber, i.InstituteName, p.ProgramName
FROM Choice_List c
JOIN Institute_Program ip ON c.InstituteCode = ip.InstituteCode 
                           AND c.ProgramCode = ip.ProgramCode
JOIN Institute i ON ip.InstituteCode = i.InstituteCode
JOIN Program p ON ip.ProgramCode = p.ProgramCode
WHERE c.CandidateID = 10001
ORDER BY c.ChoiceNumber;
```

### 2. Get Seat Matrix for an Institute
```sql
SELECT p.ProgramName, sm.Category, sm.Quota, sm.SeatPool, sm.TotalSeats
FROM Seat_Matrix sm
JOIN Institute_Program ip ON sm.InstituteCode = ip.InstituteCode 
                           AND sm.ProgramCode = ip.ProgramCode
JOIN Program p ON ip.ProgramCode = p.ProgramCode
WHERE sm.InstituteCode = 'IITB'
ORDER BY p.ProgramName, sm.Category;
```

### 3. Get Opening/Closing Ranks for a Program
```sql
SELECT i.InstituteName, ocr.Category, ocr.Quota, 
       ocr.OpeningRank, ocr.ClosingRank
FROM Opening_Closing_Ranks ocr
JOIN Institute i ON ocr.InstituteCode = i.InstituteCode
WHERE ocr.ProgramCode = 'CSE' 
  AND ocr.RoundID = 6
  AND ocr.Quota = 'AI'
ORDER BY ocr.ClosingRank;
```

### 4. Get Allocation History for a Candidate
```sql
SELECT a.RoundID, i.InstituteName, p.ProgramName, 
       a.Action, a.Fee_Payment_Status
FROM Allocation a
JOIN Institute i ON a.AllocatedInstituteCode = i.InstituteCode
JOIN Program p ON a.AllocatedProgramCode = p.ProgramCode
WHERE a.CandidateID = 10001
ORDER BY a.RoundID;
```

### 5. Find Available Seats for a Category
```sql
SELECT i.InstituteName, p.ProgramName, sm.TotalSeats,
       (sm.TotalSeats - COALESCE(allocated.count, 0)) AS AvailableSeats
FROM Seat_Matrix sm
JOIN Institute_Program ip ON sm.InstituteCode = ip.InstituteCode 
                           AND sm.ProgramCode = ip.ProgramCode
JOIN Institute i ON ip.InstituteCode = i.InstituteCode
JOIN Program p ON ip.ProgramCode = p.ProgramCode
LEFT JOIN (
    SELECT AllocatedInstituteCode, AllocatedProgramCode, COUNT(*) as count
    FROM Allocation
    WHERE RoundID = 1
    GROUP BY AllocatedInstituteCode, AllocatedProgramCode
) allocated ON sm.InstituteCode = allocated.AllocatedInstituteCode
            AND sm.ProgramCode = allocated.AllocatedProgramCode
WHERE sm.Category = 'OPEN' AND sm.Quota = 'AI'
HAVING AvailableSeats > 0;
```

### 6. Get Top 10 Most Preferred Programs
```sql
SELECT ip.InstituteCode, ip.ProgramCode, 
       i.InstituteName, p.ProgramName,
       COUNT(*) as ChoiceCount
FROM Choice_List cl
JOIN Institute_Program ip ON cl.InstituteCode = ip.InstituteCode 
                           AND cl.ProgramCode = ip.ProgramCode
JOIN Institute i ON ip.InstituteCode = i.InstituteCode
JOIN Program p ON ip.ProgramCode = p.ProgramCode
GROUP BY ip.InstituteCode, ip.ProgramCode, i.InstituteName, p.ProgramName
ORDER BY ChoiceCount DESC
LIMIT 10;
```

---

## 📖 Glossary

| Term | Definition |
|------|------------|
| **JEE** | Joint Entrance Examination - entrance exam for engineering colleges |
| **JoSAA** | Joint Seat Allocation Authority - centralized seat allocation body |
| **AIR** | All India Rank - overall rank in JEE |
| **IIT** | Indian Institute of Technology |
| **NIT** | National Institute of Technology |
| **IIIT** | Indian Institute of Information Technology |
| **GFTI** | Government Funded Technical Institute |
| **OPEN** | General category (no reservation) |
| **OBC-NCL** | Other Backward Classes - Non-Creamy Layer |
| **SC** | Scheduled Caste |
| **ST** | Scheduled Tribe |
| **EWS** | Economically Weaker Section |
| **PwD** | Person with Disability |
| **AI Quota** | All India Quota - open to candidates from all states |
| **HS Quota** | Home State Quota - reserved for state residents |
| **OS Quota** | Other State Quota - for non-residents |
| **Gender-Neutral** | Seats available to all genders |
| **Female-Only** | Seats reserved for female candidates |
| **Freeze** | Accept allocation and stop participating |
| **Float** | Accept allocation but keep looking for upgrades |
| **Slide** | Accept but allow program changes in same institute |
| **Opening Rank** | Best rank that got admission |
| **Closing Rank** | Last rank that got admission |

---

## 📊 Database Statistics

**Total Tables:** 9

**Core Entities:**
- Candidates (Students)
- Institutes (Colleges)
- Programs (Academic Courses)

**Junction/Association Tables:**
- Institute_Program (Many-to-Many relationship)

**Transaction Tables:**
- Choice_List (Student Preferences)
- Allocation (Seat Assignment Results)

**Reference Tables:**
- Counselling_Round (Time Periods)
- Seat_Matrix (Available Seats)
- Opening_Closing_Ranks (Historical Cutoffs)

**Foreign Keys:** 11  
**Unique Constraints:** 3  
**Check Constraints:** 1

---

## 🔧 Database Setup

### Create Database
```sql
CREATE DATABASE DBMS_TermProject;
USE DBMS_TermProject;
```

### Import Schema
```bash
mysql -u root -p DBMS_TermProject < DBMS_TermProject.sql
```

### Verify Tables
```sql
SHOW TABLES;
```

### Check Table Structure
```sql
DESCRIBE Candidate;
DESCRIBE Institute;
-- ... for other tables
```

---

## 📝 Notes

1. **Scalability:** Database is designed to handle thousands of candidates and hundreds of institutes
2. **Performance:** Indexes on foreign keys ensure fast JOIN operations
3. **Flexibility:** Can accommodate new quota types, categories, and seat pools
4. **Audit Trail:** Timestamp in Allocation table provides history
5. **Data Integrity:** Foreign key constraints ensure data consistency

---

**Database Created:** October 3, 2025  
**Last Updated:** November 14, 2025  
**Version:** 1.0

<<<<<<< HEAD
# empolyee-management
This is second project
=======
# EPMS — Employee Payroll Management System
**SmartPark, Rubavu District, Rwanda**
TSS National Practical Exam 2024–2025

---

## 📋 PROJECT STRUCTURE

```
EPMS/
├── backend-project/        ← Node.js + Express API
│   ├── config/
│   │   ├── db.js           ← MySQL connection pool
│   │   └── initDB.js       ← DB + tables setup script
│   ├── controllers/        ← Business logic
│   ├── middleware/         ← Auth middleware
│   ├── routes/             ← API routes
│   ├── .env                ← Environment variables
│   └── server.js           ← Main entry point
│
└── frontend-project/       ← React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/     ← Layout, Navbar
    │   ├── context/        ← Auth context
    │   ├── pages/          ← Login, Dashboard, Employees, Departments, Salaries, Reports
    │   └── utils/          ← Axios instance
    ├── vite.config.js      ← Vite config with host + proxy
    └── index.html
```

---

## ⚙️ PREREQUISITES

- **Node.js** (stable version) — https://nodejs.org
- **MySQL** (running locally)
- A terminal / command prompt

---

## 🚀 SETUP & RUN (Step by Step)

### STEP 1 — Configure MySQL

Make sure MySQL is running. Open `.env` in `backend-project/` and set your credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword   ← change this
DB_NAME=EPMS
```

### STEP 2 — Initialize the Database

```bash
cd backend-project
npm install
node config/initDB.js
```

You should see:
```
✅ Database EPMS initialized successfully!
✅ Default admin user created: username=admin, password=admin123
```

### STEP 3 — Start the Backend

```bash
# Still inside backend-project/
npm run dev        # With auto-reload (nodemon)
# OR
npm start          # Production
```

Backend runs at: **http://localhost:5000**

Console output shows:
```
🚀 EPMS Backend running at:
   Local:   http://localhost:5000
   API:     http://localhost:5000/api
```

### STEP 4 — Start the Frontend

Open a **new terminal**:

```bash
cd frontend-project
npm install
npm run dev
```

Vite output will show:
```
  VITE v5.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/    ← accessible from other devices
```

### STEP 5 — Open in Browser

- **This computer:** http://localhost:5173
- **Other devices on same network:** use the Network URL shown in Vite

**Login credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🗄️ DATABASE SCHEMA

```sql
Department  (DepartmentCode PK, DepartmentName, GrossSalary)
Employee    (employeeNumber PK, FirstName, LastName, Position, Address,
             Telephone, Gender, hiredDate, DepartmentCode FK)
Salary      (SalaryID PK AI, GlossSalary, TotalDeduction, NetSalary,
             month, employeeNumber FK)
Users       (id PK AI, username UNIQUE, password)
```

**Pre-loaded departments:**
| Code | Name               | Gross Salary |
|------|--------------------|-------------|
| CW   | Carwash            | 300,000 RWF |
| ST   | Stock              | 200,000 RWF |
| MC   | Mechanic           | 450,000 RWF |
| ADMS | Administration Staff | 600,000 RWF |

---

## 🔑 UNIQUE EMPLOYEE IDs

Every new employee gets an **auto-generated unique ID** in format:
```
EMP-A1B2C3
```
Generated using UUID v4, guaranteed collision-free.

---

## 🌐 API ENDPOINTS

| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| POST   | /api/auth/login                 | Login                 |
| POST   | /api/auth/logout                | Logout                |
| GET    | /api/employees                  | List all employees    |
| POST   | /api/employees                  | Add employee          |
| PUT    | /api/employees/:id              | Update employee       |
| DELETE | /api/employees/:id              | Delete employee       |
| GET    | /api/departments                | List departments      |
| POST   | /api/departments                | Add department        |
| PUT    | /api/departments/:code          | Update department     |
| DELETE | /api/departments/:code          | Delete department     |
| GET    | /api/salaries                   | List all salaries     |
| POST   | /api/salaries                   | Add salary record     |
| PUT    | /api/salaries/:id               | Update salary         |
| DELETE | /api/salaries/:id               | Delete salary         |
| GET    | /api/salaries/report/:month     | Monthly payroll report|

---

## 💡 NOTES

- Net Salary = Gross Salary − Total Deduction (auto-calculated)
- The Vite `--host` flag exposes the app on your network IP
- Session-based authentication (24hr cookie)
- CORS configured for localhost:5173 and localhost:3000
>>>>>>> 1c5bb27 (saved)

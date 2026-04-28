const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Connect without database first to create it
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
});

const initDB = `
CREATE DATABASE IF NOT EXISTS EMPLOY;
USE EMPLOY;

CREATE TABLE IF NOT EXISTS Department (
  DepartmentCode VARCHAR(10) PRIMARY KEY,
  DepartmentName VARCHAR(100) NOT NULL,
  GrossSalary DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Employee (
  employeeNumber VARCHAR(20) PRIMARY KEY,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Position VARCHAR(50) NOT NULL,
  Address VARCHAR(100) NOT NULL,
  Telephone VARCHAR(20) NOT NULL,
  Gender ENUM('Male','Female','Other') NOT NULL,
  hiredDate DATE NOT NULL,
  DepartmentCode VARCHAR(10),
  FOREIGN KEY (DepartmentCode) REFERENCES Department(DepartmentCode) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Salary (
  SalaryID INT AUTO_INCREMENT PRIMARY KEY,
  GlossSalary DECIMAL(10,2) NOT NULL,
  TotalDeduction DECIMAL(10,2) NOT NULL,
  NetSalary DECIMAL(10,2) NOT NULL,
  month VARCHAR(20) NOT NULL,
  employeeNumber VARCHAR(20),
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT IGNORE INTO Department VALUES ('CW', 'Carwash', 300000);
INSERT IGNORE INTO Department VALUES ('ST', 'Stock', 200000);
INSERT IGNORE INTO Department VALUES ('MC', 'Mechanic', 450000);
INSERT IGNORE INTO Department VALUES ('ADMS', 'Administration Staff', 600000);

INSERT IGNORE INTO Users (username, password) VALUES ('admin', '$2a$10$B/y1jbTLhKsdKiramWypB./v7vC5q87xms/MbmO.f.xwORDP86isO');
`;

const statements = initDB
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function runInitDB() {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      process.exit(1);
    }
  });

  for (const sql of statements) {
    await new Promise((resolve, reject) => {
      connection.query(sql, (err) => {
        if (err && !err.message.includes("already exists")) {
          console.error("SQL Error:", err.message, "\nSQL:", sql);
          return reject(err);
        }
        resolve();
      });
    });
  }

  console.log("✅ Database EMPLOY initialized successfully!");
  console.log(
    "✅ Default admin user created: username=admin, password=admin123",
  );
  connection.end();
}

runInitDB().catch((err) => {
  console.error("Initialization failed:", err.message || err);
  connection.end();
  process.exit(1);
});

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Generate unique employee number: EMP-XXXX
const generateEmployeeNumber = async () => {
  let unique = false;
  let empNum;
  while (!unique) {
    const shortId = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    empNum = `EMP-${shortId}`;
    const [rows] = await db.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [empNum]);
    if (rows.length === 0) unique = true;
  }
  return empNum;
};

const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.DepartmentName 
      FROM Employee e 
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      ORDER BY e.FirstName
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.DepartmentName 
      FROM Employee e 
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      WHERE e.employeeNumber = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Employee not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode } = req.body;
    if (!FirstName || !LastName || !Position || !Address || !Telephone || !Gender || !hiredDate)
      return res.status(400).json({ message: 'All fields are required.' });

    const employeeNumber = await generateEmployeeNumber();

    await db.query(
      'INSERT INTO Employee (employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode) VALUES (?,?,?,?,?,?,?,?,?)',
      [employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode || null]
    );
    res.status(201).json({ message: 'Employee created successfully.', employeeNumber });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode } = req.body;
    const [result] = await db.query(
      'UPDATE Employee SET FirstName=?, LastName=?, Position=?, Address=?, Telephone=?, Gender=?, hiredDate=?, DepartmentCode=? WHERE employeeNumber=?',
      [FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ message: 'Employee updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Employee WHERE employeeNumber = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };

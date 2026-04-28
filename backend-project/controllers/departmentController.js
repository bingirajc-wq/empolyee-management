const db = require('../config/db');

const getAllDepartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Department ORDER BY DepartmentName');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Department WHERE DepartmentCode = ?', [req.params.code]);
    if (rows.length === 0) return res.status(404).json({ message: 'Department not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { DepartmentCode, DepartmentName, GrossSalary } = req.body;
    if (!DepartmentCode || !DepartmentName || !GrossSalary)
      return res.status(400).json({ message: 'All fields are required.' });

    await db.query(
      'INSERT INTO Department (DepartmentCode, DepartmentName, GrossSalary) VALUES (?,?,?)',
      [DepartmentCode.toUpperCase(), DepartmentName, GrossSalary]
    );
    res.status(201).json({ message: 'Department created successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Department code already exists.' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { DepartmentName, GrossSalary } = req.body;
    const [result] = await db.query(
      'UPDATE Department SET DepartmentName=?, GrossSalary=? WHERE DepartmentCode=?',
      [DepartmentName, GrossSalary, req.params.code]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found.' });
    res.json({ message: 'Department updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Department WHERE DepartmentCode = ?', [req.params.code]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found.' });
    res.json({ message: 'Department deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };

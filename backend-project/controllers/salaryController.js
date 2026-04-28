const db = require('../config/db');

const getAllSalaries = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, e.FirstName, e.LastName, e.Position, d.DepartmentName
      FROM Salary s
      JOIN Employee e ON s.employeeNumber = e.employeeNumber
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      ORDER BY s.SalaryID DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createSalary = async (req, res) => {
  try {
    const { employeeNumber, GlossSalary, TotalDeduction, month } = req.body;
    if (!employeeNumber || !GlossSalary || !TotalDeduction || !month)
      return res.status(400).json({ message: 'All fields required.' });

    const NetSalary = parseFloat(GlossSalary) - parseFloat(TotalDeduction);

    await db.query(
      'INSERT INTO Salary (GlossSalary, TotalDeduction, NetSalary, month, employeeNumber) VALUES (?,?,?,?,?)',
      [GlossSalary, TotalDeduction, NetSalary, month, employeeNumber]
    );
    res.status(201).json({ message: 'Salary record created.', NetSalary });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateSalary = async (req, res) => {
  try {
    const { GlossSalary, TotalDeduction, month, employeeNumber } = req.body;
    const NetSalary = parseFloat(GlossSalary) - parseFloat(TotalDeduction);

    const [result] = await db.query(
      'UPDATE Salary SET GlossSalary=?, TotalDeduction=?, NetSalary=?, month=?, employeeNumber=? WHERE SalaryID=?',
      [GlossSalary, TotalDeduction, NetSalary, month, employeeNumber, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json({ message: 'Salary updated.', NetSalary });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteSalary = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Salary WHERE SalaryID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary not found.' });
    res.json({ message: 'Salary deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.params;
    const [rows] = await db.query(`
      SELECT e.FirstName, e.LastName, e.Position, d.DepartmentName,
             s.GlossSalary, s.TotalDeduction, s.NetSalary, s.month
      FROM Salary s
      JOIN Employee e ON s.employeeNumber = e.employeeNumber
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      WHERE s.month = ?
      ORDER BY e.FirstName
    `, [month]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDistinctMonths = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT month FROM Salary ORDER BY month DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllSalaries, createSalary, updateSalary, deleteSalary, getMonthlyReport, getDistinctMonths };

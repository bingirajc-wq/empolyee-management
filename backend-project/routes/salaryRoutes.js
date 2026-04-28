const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getAllSalaries, createSalary, updateSalary, deleteSalary, getMonthlyReport, getDistinctMonths } = require('../controllers/salaryController');

router.get('/', isAuthenticated, getAllSalaries);
router.get('/months/distinct', isAuthenticated, getDistinctMonths);
router.get('/report/:month', isAuthenticated, getMonthlyReport);
router.post('/', isAuthenticated, createSalary);
router.put('/:id', isAuthenticated, updateSalary);
router.delete('/:id', isAuthenticated, deleteSalary);

module.exports = router;

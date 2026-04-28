const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.get('/', isAuthenticated, getAllEmployees);
router.get('/:id', isAuthenticated, getEmployee);
router.post('/', isAuthenticated, createEmployee);
router.put('/:id', isAuthenticated, updateEmployee);
router.delete('/:id', isAuthenticated, deleteEmployee);

module.exports = router;

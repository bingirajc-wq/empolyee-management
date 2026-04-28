const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getAllDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

router.get('/', isAuthenticated, getAllDepartments);
router.get('/:code', isAuthenticated, getDepartment);
router.post('/', isAuthenticated, createDepartment);
router.put('/:code', isAuthenticated, updateDepartment);
router.delete('/:code', isAuthenticated, deleteDepartment);

module.exports = router;

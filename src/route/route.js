const express = require('express');
const router = express.Router();

const studentController = require('../controller/studentController');

router.post('/register/student', studentController.createStudent)
router.get('/get/student', studentController.getStudentData)


module.exports = router
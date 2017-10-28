const express = require('express');
const router = express.Router();

const StudentRegistrationController = require('./../controllers/StudentRegistration');

router.route('/')
// Create new student route.
.post(StudentRegistrationController.newStudent);

router.route('/:nic')
// Get student detail route (post because sending token from google capcha).
.post(StudentRegistrationController.getStudent)
// Update student details given student nic.
.patch(StudentRegistrationController.updateStudent)

router.route('/:nic/confirm')
// Route to check if user has finalized his/her form information.
.post(StudentRegistrationController.confirmStudent)

router.route('/:hash/info')
.get(StudentRegistrationController.getHashedStudent)

router.route('/payment/36053764d32fa15450a622dab4ac3b4b')
.post(StudentRegistrationController.paymentComplete)

module.exports = router;
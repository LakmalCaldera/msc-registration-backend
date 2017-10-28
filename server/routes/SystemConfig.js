const express = require('express');
const router = express.Router();

const SystemConfigController = require('./../controllers/SystemConfig');

router.route('/')
// Create new student route.
.get(SystemConfigController.getInfo);

module.exports = router;
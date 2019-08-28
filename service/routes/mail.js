const express = require('express');
const router = express.Router();
const MailController = require('../controllers/mailController');
router.post('/sendCode', MailController.sendCode);
module.exports = router;

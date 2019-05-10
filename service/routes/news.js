const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
router.get('', newsController.getNews);
router.post('', newsController.createNews);
router.put('/:id', newsController.editNewsById);
router.get('/:id',newsController.getNewsById);
router.delete('/:id',newsController.deleteNewsById);
module.exports = router;

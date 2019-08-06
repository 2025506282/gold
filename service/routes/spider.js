const express = require('express');
const router = express.Router();
const goldSpiderController = require('../controllers/spider/goldSpiderController');
// router.get('', newsController.getNews);
// router.post('/gold', goldSpiderController.spiderGold);
router.post('/url', goldSpiderController.spiderUrl);
router.post('/urls', goldSpiderController.spiderUrls);
// router.put('/:id', newsController.editNewsById);
// router.get('/:id',newsController.getNewsById);
// router.delete('/:id',newsController.deleteNewsById);
module.exports = router;

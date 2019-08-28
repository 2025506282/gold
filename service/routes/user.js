const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('', userController.getUsers);
router.post('', userController.createUser);
router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.post('/edit', userController.editUserById);
router.put('/:id', userController.editUserById);
router.get('/:id',userController.getUserById);
router.delete('/:id',userController.deleteUserById);
module.exports = router;

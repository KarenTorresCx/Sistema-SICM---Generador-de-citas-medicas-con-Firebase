const express = require('express');
const router = express.Router();

const usersDao = require('../dao/users.dao');

router.post('/register', usersDao.register);

router.post('/login', usersDao.login);

module.exports = router;
const express = require('express');
const router = express.Router();
const etlDao = require('../dao/etl.dao');

router.post('/', etlDao.executeETL);

module.exports = router;
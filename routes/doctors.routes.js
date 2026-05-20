const express = require("express");
const router = express.Router();
const doctorDao = require("../dao/doctor.dao");

router.get('/', doctorDao.getAll);
router.get('/:id', doctorDao.getById);
router.post('/', doctorDao.create);
router.delete('/:id', doctorDao.deleteById); 

module.exports = router;
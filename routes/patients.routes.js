const express = require("express");
const router = express.Router();
const patientDao = require("../dao/patient.dao"); 

router.get('/', patientDao.getAll);
router.get('/:id', patientDao.getById);
router.post('/', patientDao.create);
router.delete('/:id', patientDao.deleteById); 

module.exports = router;
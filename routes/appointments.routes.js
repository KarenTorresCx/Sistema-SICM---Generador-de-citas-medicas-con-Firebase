const express = require("express");
const router = express.Router();
const appointmentDao = require("../dao/appointment.dao");

router.get('/', appointmentDao.getAll);
router.get('/:id', appointmentDao.getById);
router.post('/', appointmentDao.create);
router.delete('/:id', appointmentDao.deleteById); 

module.exports = router;
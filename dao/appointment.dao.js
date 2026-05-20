const db = require('../services/mysql.service');
const analyticsDao = require('./analytics.dao');
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointment WHERE appointment_id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Cita no encontrada' });
    } else {
      res.json(rows[0]);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointment');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const create = async (req, res) => {
  try {
    const {
      date,
      time,
      patient_id,
      doctor_id,
      note
    } = req.body;

    const [result] = await db.query(

      'INSERT INTO appointment (date, time, patient_id, doctor_id, note) VALUES (?, ?, ?, ?, ?)',

      [
        date,
        time,
        patient_id,
        doctor_id,
        note
      ]

    );

    console.log(
      'Guardando evento en Firebase'
    );

    // Firebase
    await analyticsDao.saveEvent({

      event_type:
      'appointment_created',

      appointment_id:
      result.insertId,

      patient_id:
      patient_id,

      doctor_id:
      doctor_id,

      note:
      note || null,

      timestamp:
      new Date(),

      device:
      'desktop'

    });

    res.json({

      message:
      'Cita creada',

      id:
      result.insertId

    });

  }

  catch (e) {

    res.status(500).json({

      error:
      e.message

    });

  }

};

const deleteById = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM appointment WHERE appointment_id = ?', [req.params.id]);
    result.affectedRows > 0 
      ? res.json({ message: 'Cita eliminada correctamente' })
      : res.status(404).json({ error: 'Cita no encontrada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getAll, getById, create, deleteById };
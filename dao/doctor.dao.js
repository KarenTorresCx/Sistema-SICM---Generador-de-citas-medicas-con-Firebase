const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctor');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener médicos' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM doctor WHERE doctor_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar médico' });
  }
};

const create = async (req, res) => {
  try {
    const { name, last_name, phone, email } = req.body;

    const [result] = await db.query(
      'INSERT INTO doctor (name, last_name, phone, email) VALUES (?, ?, ?, ?)',
      [name, last_name, phone, email]
    );

    res.json({ message: 'Médico creado', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear médico' });
  }
};

const deleteById = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM doctor WHERE doctor_id = ?',
      [req.params.id]
    );

    result.affectedRows > 0
      ? res.json({ message: 'Médico eliminado correctamente' })
      : res.status(404).json({ error: 'Médico no encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar médico' });
  }
};

module.exports = { getAll, getById, create, deleteById };
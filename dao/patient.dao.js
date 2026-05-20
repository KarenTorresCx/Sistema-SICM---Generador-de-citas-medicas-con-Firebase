const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM patient');
  res.json(rows);
};

const getById = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM patient WHERE patient_id = ?', [req.params.id]);
  rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
};

const create = async (req, res) => {
  const { name, last_name, doc_identity, phone, email, birthdate } = req.body;
  const [result] = await db.query(
    'INSERT INTO patient (name, last_name, doc_identity, phone, email, birthdate) VALUES (?, ?, ?, ?, ?, ?)',
    [name, last_name, doc_identity, phone, email, birthdate]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
};

const deleteById = async (req, res) => {
  const [result] = await db.query('DELETE FROM patient WHERE patient_id = ?', [req.params.id]);
  result.affectedRows > 0 
    ? res.json({ message: 'Paciente eliminado correctamente' })
    : res.status(404).json({ error: 'Paciente no encontrado' });
};

module.exports = { getAll, getById, create, deleteById };
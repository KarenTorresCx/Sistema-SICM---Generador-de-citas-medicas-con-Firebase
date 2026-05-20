const mysql = require('../services/mysql.service');

async function getAllSpecialties() {

    const query = `SELECT * FROM specialty ORDER BY name ASC`;

    return await mysql.query(query);
}

async function createSpecialty(specialty) {

    const query = `INSERT INTO specialty (name) VALUES (?)`;

    return await mysql.query(query, [specialty.name]);
}

async function deleteSpecialty(id) {

    const query = `DELETE FROM specialtyWHERE specialty_id = ?`;

    return await mysql.query(query, [id]);
}

module.exports = {
    getAllSpecialties,
    createSpecialty,
    deleteSpecialty
};
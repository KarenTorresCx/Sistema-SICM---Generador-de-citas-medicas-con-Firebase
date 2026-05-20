const db = require('../services/mysql.service');
const crypto = require('crypto');

const PEPPER = 'SICM_SECRET_2026';

function generateSalt() {

    return crypto
        .randomBytes(16)
        .toString('hex');

}

function hashPassword(password, salt) {

    let hash = password + salt + PEPPER;

    for (let i = 0; i < 1000; i++) {

        hash = crypto
            .createHash('sha256')
            .update(hash)
            .digest('hex');

    }

    return hash;
}

const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const salt = generateSalt();

        const passwordHash =
            hashPassword(password, salt);

        const [result] = await db.query(

            `INSERT INTO users
            (username, email, salt, password_hash)
            VALUES (?, ?, ?, ?)`,

            [
                username,
                email,
                salt,
                passwordHash
            ]

        );

        res.status(201).json({
            message: 'Usuario registrado',
            userId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] = await db.query(

            'SELECT * FROM users WHERE email = ?',

            [email]

        );

        if (rows.length === 0) {

            return res.status(401).json({
                error: 'Usuario no encontrado'
            });

        }

        const user = rows[0];

        const generatedHash =
            hashPassword(password, user.salt);

        if (
            generatedHash !== user.password_hash
        ) {

            return res.status(401).json({
                error: 'Contraseña incorrecta'
            });

        }

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

module.exports = {
    register,
    login
};
const express = require('express');
const router = express.Router();

const specialtyDao = require('../dao/specialty.dao');

router.get('/', async (req, res) => {

    try {

        const specialties =
            await specialtyDao.getAllSpecialties();

        res.json(specialties);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

router.post('/', async (req, res) => {

    try {

        const result =
            await specialtyDao.createSpecialty(
                req.body
            );

        res.json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

router.delete('/:id', async (req, res) => {

    try {

        const result =
            await specialtyDao.deleteSpecialty(
                req.params.id
            );

        res.json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;
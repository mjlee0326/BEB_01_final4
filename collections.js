const express = require('express');
const { Collections } = require('../models');
const router = express.Router();


//All Collections List
router.get('/', async (req, res, next) => {
    try {
        const allCollections = await Collections.findAll({});
        res.json({ message: "ok", data: allCollections });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
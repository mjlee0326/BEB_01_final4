const express = require('express');
const { Collections } = require('../models');
const router = express.Router();


// Collection 검색
router.get('/', async (req, res, next) => { // qurey: name 
    try {
        const name = req.body.name;
        if (!name) {
            const allCollections = await Collections.findAll({});
            res.status(200).json({ message: "ok", data: allCollections });
        }
        const collections = await Collections.findAll({ where: { name: name } });
        res.status(200).json({ message: "ok", data: collections });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
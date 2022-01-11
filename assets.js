const express = require('express');
const { NFTs } = require('../models');
const router = express.Router();


// All NFTs List
router.get('/', async (req, res, next) => {
    try {
        const allNFTs = await NFTs.findAll({});
        res.json({ message: "ok", data: allNFTs });
    } catch (err) {
        console.error(err);
    }
});

// NFT 1개 상세
router.get('/:token_ids', async (req, res, next) => {
    console.log(req.params.token_ids);
    const token_ids = req.params.token_ids;
    const nft = await NFTs.findAll({ where: { token_ids: token_ids } });
    if (!nft) {
        res.status(400).json({ message: "token_ids가 일치하는 NFT가 없습니다" });
        return;
    }
    res.json({ message: "ok", data: nft });
});


module.exports = router;
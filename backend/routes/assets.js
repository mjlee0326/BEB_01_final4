const express = require('express');
const { NFTs, Collections, Trades, Rents, Users } = require('../models');
const { Op } = require("sequelize");
const router = express.Router();
const config = require('../config/config');
const hostURI = config.development.host_metadata;
const utils = require('./utils');

/*
 *  /assets
 *  All NFTs List
 *  향후 조건을 입력받아 처리해 줄 듯
 */
router.get('/', async (req, res, next) => {
    console.log('?');
    try {
        const qNFTs = await NFTs.findAll({
            where: {
                is_minted: true
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });

        let result = [];

        //각 NFT 에 대하여 추가 정보 추출
        for (let i = 0; i < qNFTs.length; i++) {
            let NFT = qNFTs[i].dataValues;

            //각 NFT의 collection 데이터
            const nftCollection = await Collections.findOne({
                where: {
                contractAddress: NFT.contractAddress
                }
            });
            if(nftCollection) {
                NFT.collection = nftCollection.dataValues;
            }


            //trade sort 옵션
            let whereOption = {
                token_ids : NFT.token_ids,
                collectionAddress : NFT.contractAddress,
                status : 'selling'
            };

            //트레이드 정보 추가
            let qTrades = await Trades.findOne({
                where: whereOption,
            });

            //만약 Trade 내역이 존재한다면
            NFT.isSelling = false;
            NFT.price = null;
            NFT.trade_ca = null;
            NFT.seller = null;
            NFT.isLending = false;
            NFT.isRenting = false;
            
            //만약 Trade 내역이 존재한다면 NFT 에 그 내역들을 추가
            if(qTrades) {
                NFT.isSelling = true;
                NFT.price = qTrades.price;
                NFT.trade_ca = qTrades.trade_ca;
                NFT.seller = qTrades.seller;
            }

                    //대여 정보 추가
            let qRent = await Rents.findOne({
                where: {
                token_ids: NFT.token_ids,
                collectionAddress: NFT.contractAddress,
                [Op.or]: [{ status: 'lend' }, { status: 'rent' }],
                },
            });
            if(qRent) {
                if(qRent.status == 'lend') {
                    NFT.isLending = true;
                    NFT.price = qRent.price;
                    NFT.seller = qRent.owner;
                    //NFT.lending = qRent.dataValues;
                } 
                else if(qRent.status == 'rent') {
                    NFT.isRenting = true;
                    NFT.price = qRent.price;
                    NFT.seller = qRent.owner;
                    //NFT.renting = qRent.dataValues;
                }
            }

            result.push(NFT);
        }

        res.json({ message: "ok", data: result });
    } catch (err) {
        console.error(err);
    }
});

/*
 *  /assets/<collection_symbol>/<token_ids>
 *  NFT 1개 상세
 *  required: collection_symbol, token_ids
 */
router.get('/:symbol/:token_ids', async (req, res, next) => {
    console.log(req.params.symbol);
    console.log(req.params.token_ids);
    const reqSymbol = req.params.symbol;
    const reqID = req.params.token_ids;

    //join해줘야 되는데 sequelize로 어떻게 하지?
    const collection = await Collections.findOne({
        where: {
            symbol: reqSymbol
        }
    });

    if (!collection) {
        res.status(400).json({ message: "symbol이 일치하는 Collection이 없습니다" });
        return;
    }

    const nftResult = await NFTs.findOne({
        where: {
            contractAddress: collection.dataValues.contractAddress,
            token_ids: reqID,
            is_minted: true
        }
    });

    if (!nftResult) {
        res.status(400).json({ message: "token_ids가 일치하는 NFT가 없습니다" });
        return;
    }
    let NFT = nftResult.dataValues;
    NFT = await utils.addNftInfo(NFT);

    res.json({ message: "ok", data: NFT });
});

/*
 *  /assets
 *  NFT 데이터 생성 (metadata 정보 회신)
 *  required: ownerAddress, contractAddress, name, description, traits, imageURI
 */
router.post('/', async (req, res, next) => {
    try {
        console.log(`======== [POST] /assets ========`);
        //입력 인자 가공
        if (!req.body.ownerAddress || !req.body.contractAddress ||
            !req.body.name || !req.body.description ||
            !req.body.traits || !req.body.imageURI) {
            throw new SyntaxError("required: ownerAddress, contractAddress, name, description, traits, imageURI");
        }

        let reqData = {
            is_minted: false,
            ownerAddress: req.body.ownerAddress,
            creatorAddress: req.body.ownerAddress,
            contractAddress: req.body.contractAddress,
            name: req.body.name,
            description: req.body.description,
            //traits: JSON.stringify(req.body.traits),
            traits: req.body.traits,
            imageURI: req.body.imageURI
        };

        let qRes = await NFTs.create(reqData);
        let tokenURI = `${hostURI}/metadata/nft/${qRes.dataValues.id}`;

        console.log(`tokenURI 가 생성됨 : ${tokenURI}`);
        res.status(200).json({
            message: 'ok',
            data: {
                tokenURI
            }
        });

    } catch (err) {
        console.error(`에러 ${err}`);
        res.status(400).json({
            message: err.message,
            data: null
        });
    }
});

module.exports = router;
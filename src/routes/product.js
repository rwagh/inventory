const helper = require("../Helper.js");
const express = require('express');
const router = express.Router();

router.post('/add', async(req, res) => {
    let args = req.body;
    try {
        let item = await helper.add(args);
        res.status(200).send({
            ...item
        });

    } catch (err) {
        res.status(400).send({
            error: err.message
        });
    }
});

router.get('/:id', async(req, res) => {
    let id = req.params.id;
    try {
        let row = await helper.get(id);
        res.status(200).send({...row });
    } catch (err) {
        res.status(400).send({
            error: err.message
        });
    }
});

router.delete('/:id', async(req, res) => {
    let id = req.params.id;
    try {
        let row = await helper.remove(id);
        if (row.id === Number(id) && row.deleted === 1) {
            res.status(200).send({ message: `product id (${id}) has been deleted` });
        }
    } catch (err) {
        res.status(400).send({
            error: err.message
        });
    }
});

router.post('/list', async(req, res) => {
    let args = req.body;
    try {
        let list = await helper.list(args);
        res.status(200).send(list);
    } catch (err) {
        res.status(400).send({
            error: err.message
        });
    }
});

router.get('/popular/:top/:currency?', async(req, res) => {
    let top = req.params.top;
    let currency = req.params.currency;
    try {
        let list = await helper.most_viewed(top, currency);
        res.status(200).send(list);
    } catch (err) {
        res.status(400).send({
            error: err.message

        });
    }
});
module.exports = router;
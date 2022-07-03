const express = require("express");
let router = express.Router();

let productModel = require('../../models/productos.model')();

router.get('/one/:id', (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id);
        productModel.getOne(id, (err, rslts) => {
            if (err) {
                console.error();
                return res.status(502).json({"Error": err})
            }
            else {
                return res.status(200).json({ "result": rslts });
            }
        });
    } catch (ex) {
        console.error('Error User', ex);
        return res.status(502).json({ 'error': 'Error Interno de Server' });
    }


});
module.exports = router;
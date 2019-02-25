const express = require("express");
const Syndrome = require("../models/Syndrome");
const router = express.Router();
const errors = require('../errors');
const utils = require('../utils');

//
router.get("/syndrome", function (req, res) {
    Syndrome.findOne({_id: req.query.syndromeId}, {syndrome: 1})
        .populate({
            path: 'syndrome',
            select: 'nodeName -_id'
        })
        .exec(function (err, syndrome) {
            if (err) throw err;
            let syndromeName = '';
            syndrome.syndrome.forEach(function (data) {
                syndromeName += data.nodeName + '；'
            });
            res.send(utils.combineJson(errors.e0, {
                syndromeId:syndrome._id,
                syndromeName: syndromeName.substring(0,syndromeName.lastIndexOf('；'))
            }))
        })
});


module.exports = router;
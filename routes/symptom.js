/**
 * Created by Administrator on 2017/3/27.
 */
const express = require("express");
const Assortment = require("../models/Assortment");
const Symptom = require("../models/Symptom");
const Disease_symptom = require("../models/Disease_symptom");
const router = express.Router();
const Promise = require('bluebird');
const async = require('async');
const errors = require('../errors');
const utils = require('../utils');


router.get("/symptom", function (req, res) {
    Symptom.findOne({_id: req.query.symptomId}, {symptom: 1})
        .populate({
            path: 'symptom',
            select: 'nodeName -_id'
        })
        .exec(function (err, symptom) {
            if (err) throw err;
            let symptomName = '';
            symptom.symptom.forEach(function (data) {
                symptomName += data.nodeName + '；'
            });
            res.send(utils.combineJson(errors.e0, {
                symptomId:symptom._id,
                symptomName: symptomName.substring(0,symptomName.lastIndexOf('；'))
            }))
        })
});

module.exports = router;
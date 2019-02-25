var express = require('express');
var User = require('../models/User');
var Tcmt_syndrome = require('../models/Tcmt_syndrome');
var Symptom = require('../models/Symptom');
var Syndrome = require('../models/Syndrome');
var Assortment = require('../models/Assortment');
var Type = require('../models/Type');
var Frequency = require('../models/Frequency');
var errors = require('../errors');
var utils = require('../utils');
var enumeration = require('../enumeration');
var router = express.Router();
const async = require('async');

//获取常用症状列表
router.get('/commonSymptomList', function (req, res) {
    Frequency.find({
        userId: req.query.userId,
        type: enumeration.frequencyType.symptom,
        del: false
    }, {
        count: 1,
        symptomId: 1
    })
        .sort({count:-1})
        .limit(15)
        .populate({
            path: 'symptomId',
            select: 'symptom',
            populate: {
                path: 'symptom',
                select: 'nodeName'
            }
        })
        .exec(function (err, symptomList) {
            if (err) throw err;
            // console.log('sss:',symptomList)
            if (symptomList.length==0) {
                res.send(errors.e112);
                return;
            }
            let symptomArr = [];
            for (let i = 0; i < symptomList.length; i++) {
                symptomArr[i] = {};
                symptomArr[i]._id = symptomList[i]._id;
                symptomArr[i].count = symptomList[i].count;
                symptomArr[i].symptomId = symptomList[i].symptomId._id;
                let symptom = '';
                let ss = symptomList[i].symptomId.symptom;
                for (let j = 0; j < ss.length; j++) {
                    symptom += ss[j].nodeName + '；';
                }
                symptomArr[i].symptom = symptom.substring(0, symptom.lastIndexOf('；'));
            }
            // console.log('ss:', symptomArr)
            res.send(Object.assign({symptomList: symptomArr}, errors.e0));
        })
});

//获取常用症候列表
router.get('/commonSyndromeList', function (req, res) {
    Frequency.find({
        userId: req.query.userId,
        type: enumeration.frequencyType.syndrome,
        del: false
    }, {
        count: 1,
        syndromeId: 1
    })
        .sort({count:-1})
        .limit(15)
        .populate({
            path: 'syndromeId',
            select: 'syndrome',
            populate: {
                path: 'syndrome',
                select: 'nodeName'
            }
        })
        .exec(function (err, syndromeList) {
            if (err) throw err;
            // console.log('ss:', syndromeList)
            if (syndromeList.length==0) {
                res.send(errors.e112);
                return;
            }
            let syndromeArr = [];
            for (let i = 0; i < syndromeList.length; i++) {
                syndromeArr[i] = {};
                syndromeArr[i]._id = syndromeList[i]._id;
                syndromeArr[i].count = syndromeList[i].count;
                syndromeArr[i].syndromeId = syndromeList[i].syndromeId._id;
                let syndrome = '';
                let ss = syndromeList[i].syndromeId.syndrome;
                for (let j = 0; j < ss.length; j++) {
                    syndrome += ss[j].nodeName + '；';
                }
                syndromeArr[i].syndrome = syndrome.substring(0, syndrome.lastIndexOf('；'));
            }
            // console.log('ss:', syndromeArr)
            res.send(Object.assign({syndromeList: syndromeArr}, errors.e0));
        })
});

//移除常用症状或者症候
router.delete('/frequency',function (req, res) {
    Frequency.update({_id:req.body.frequencyId},{del:true},function (err, result) {
        if(err) throw err;
        if(result.n==0){
            res.send(errors.e112);
            return;
        }
        res.send(errors.e0);
    })
});

module.exports = router;

var express = require('express');
var User = require('../models/User');
var Tcmt_syndrome = require('../models/Tcmt_syndrome');
var Tcmt = require('../models/Tcmt');
var Frequency = require('../models/Frequency');
var Record = require('../models/Record');
var Treatment = require('../models/Treatment');
var Syndrome = require('../models/Syndrome');
var errors = require('../errors');
var utils = require('../utils');
var enumeration = require('../enumeration');
var router = express.Router();
const async = require('async');
const _ = require('underscore');

router.post('/diagnoseTcmt', function (req, res) {
    console.log('req.body',req.body)
    //获取医生ID
    let userId = req.body.userId;
    //获取已选症状并处理数据
    let chosenSyndrome = utils.turnStringToNumberInArray(req.body.chosenSyndrome.split('&'));
    console.log('ccc:', chosenSyndrome)
    //获取当前diseaseId对应的所有tcmtId
    Treatment.aggregate([
        {
            $match:{
                diseaseId:parseInt(req.body.diseaseId),
                del:false
            }
        },
        {
            $group:{
                _id:null,
                treatments:{
                    $push:'$tcmtId'
                }
            }
        }
    ],function (err, t2) {
        if(err) throw err;
        if(t2.length==0){
            res.send(errors.e116);
            return;
        }
        console.log('t2:',t2)
        Tcmt_syndrome.aggregate([
            {
                $match: {
                    del: false,
                    syndromeId: {$in: chosenSyndrome}
                }
            },
            {
                $group: {
                    _id: '$tcmtId',
                    selectWeight: {$sum: '$weight'},
                    totalWeight: {$avg: '$totalWeight'}
                }
            },
            {
                $project: {
                    _id: 0,
                    tcmtId: '$_id',
                    probability: {$divide: ['$selectWeight', '$totalWeight']}
                }
            },
            {
                $project: {
                    tcmtId: 1,
                    probability: {$floor: {$multiply: ['$probability', 100]}}
                }
            },
            {
                $match:{
                    tcmtId:{$in:t2[0].treatments}
                }
            }
        ])
            .exec(function (err, t1) {
                if (err) throw err;
                 console.log('ddd:', t1)
                Tcmt_syndrome.populate(t1, {
                    path: 'tcmtId',
                    select: 'tcmtName'
                }, function (err, probabilityList) {
                    if (err) throw err;
                    //记录医生使用某症候的频次
                    async.map(chosenSyndrome, function (item, callback) {
                        Frequency.findOne({userId: userId, syndromeId: item}, function (err, frequency) {
                            if (err) throw err;
                            if (frequency) {
                                frequency.count++;
                                frequency.save();
                                callback(null, null)
                            } else {
                                Frequency.create({
                                    userId: userId,
                                    syndromeId: item,
                                    count: 1,
                                    type: enumeration.frequencyType.syndrome
                                }, function (err, f1) {
                                    callback(err, f1);
                                });
                            }
                        })
                    }, function (err, result) {
                        if (err) {
                            res.send(errors.e115);
                            throw err;
                        }
                        //更新诊断状态为“诊断中”
                        Record.update({_id: req.body.recordId}, {
                            progress: enumeration.progress.diagnosing,
                            chosenSyndrome:chosenSyndrome
                        }, function (err, r1) {
                            if (err) throw err;
                            // console.log('d1:', req.body.recordId)
                            if (r1.n == 0) {
                                res.send(errors.e112);
                                return;
                            }
                            console.log('d1:', probabilityList)
                            res.send(Object.assign({probabilityList: probabilityList}, errors.e0));
                        })
                    })
                })
            })
    })
});

router.post('/tcmtDiagnoseDetail', function (req, res) {
    let tcmtId = req.body.tcmtId;
    let diseaseId = req.body.diseaseId;
    //获取已选症状并处理数据
    let chosenSyndrome = utils.turnStringToNumberInArray(req.body.chosenSyndrome.split('&'));
    // let chosenSymptom = req.body.chosenSymptom;
    Tcmt_syndrome.find({tcmtId: tcmtId, del: false}, function (err, t1) {
        if (err) throw err;
        //将所有匹配到的symptomId，放入一个数组
        let syndromeArr = [];
        t1.forEach(function (item) {
            syndromeArr.push(item.syndromeId)
        });
        // console.log('req.body:',req.body)
        // console.log('ccccc:', chosenSymptom)
        // console.log('ssssssss:',symptomArr)
        //用underscore处理syndromeArr和chosenSyndrome两个数组，匹配情况
        let matchSyndrome = _.intersection(syndromeArr, chosenSyndrome);
        let mismatchSyndrome = _.difference(chosenSyndrome, syndromeArr);
        let otherSyndrome = _.difference(syndromeArr, chosenSyndrome);
        // console.log('s1:', matchSymptom)
        // console.log('s2:', mismatchSymptom)
        // console.log('s3:', otherSymptom)
        //获取症状名称
        async.map([matchSyndrome, mismatchSyndrome, otherSyndrome], function (item, callback) {
            if (item.length == 0 || !item[0]) {
                callback(null, [])
            } else {
                Syndrome.populate({syndromes: item}, {
                    path: 'syndromes',
                    select: 'syndrome',
                    populate: {
                        path: 'syndrome',
                        select: 'nodeName'
                    }
                }, function (err, s1) {
                    if (err) {
                        callback(err, null);
                        throw err;
                    }
                    let syndrome1 = [];
                    for (let i = 0; i < s1.syndromes.length; i++) {
                        syndrome1[i] = {};
                        syndrome1[i].syndromeId = s1.syndromes[i]._id;
                        let syndrome = '';
                        let ss = s1.syndromes[i].syndrome;
                        for (let j = 0; j < ss.length; j++) {
                            syndrome += ss[j].nodeName + '；';
                        }
                        syndrome1[i].syndrome = syndrome.substring(0, syndrome.lastIndexOf('；'));
                    }
                    callback(null, syndrome1)
                });
            }
        }, function (err, result) {
            if (err) {
                res.send(errors.e115);
                return;
            }
            Treatment.findOne({tcmtId: tcmtId,diseaseId:diseaseId}, function (err, t2) {
                if (err) throw err;
                res.send(Object.assign({
                    matchSyndrome: result[0],
                    mismatchSyndrome: result[1],
                    otherSyndrome: result[2],
                    treatmentDetail: t2.treatmentDetail
                }, errors.e0))
            });
        })
    })
});

module.exports = router;

var express = require('express');
var User = require('../models/User');
var Disease = require('../models/Disease');
var Disease_symptom = require('../models/Disease_symptom');
var Frequency = require('../models/Frequency');
var Record = require('../models/Record');
var Symptom = require('../models/Symptom');
var errors = require('../errors');
var utils = require('../utils');
var enumeration = require('../enumeration');
var router = express.Router();
const async = require('async');
const _ = require('underscore');

router.post('/diagnoseDisease', function (req, res) {
    //获取医生ID
    let userId = req.body.userId;
    //获取已选症状并处理数据
    let chosenSymptom = utils.turnStringToNumberInArray(req.body.chosenSymptom.split('&'));
    // let chosenSymptom = req.body.chosenSymptom;
    console.log('ccc:', chosenSymptom)
    // //得出过滤选中病种的筛选条件
    // Disease.find({diseaseEntity:req.body.diseaseEntity,del:false},{_id:1},function (err, diseases) {
    //     if(err) throw err;
    //     // console.log('dddsss:',diseases)
    //     let diseaseIds = [];
    //     diseases.forEach(function (item) {
    //         diseaseIds.push(item._id)
    //     });
        //计算可能的结果
        Disease_symptom.aggregate([
            {
                $match: {
                    del: false,
                    symptomId: {$in: chosenSymptom},
                    // diseaseId:{$in:diseaseIds}
                }
            },
            {
                $group: {
                    _id: '$combineParam',
                    diseaseId: {$avg: '$diseaseId'},
                    weight: {$avg: '$weight'},
                    totalWeight: {$avg: '$totalWeight'}
                }
            },
            {
                $group: {
                    _id: '$diseaseId',
                    selectWeight: {$sum: '$weight'},
                    totalWeight: {$avg: '$totalWeight'}
                }
            },
            {
                $project: {
                    _id: 0,
                    diseaseId: '$_id',
                    probability: {$divide: ['$selectWeight', '$totalWeight']}
                }
            },
            {
                $project: {
                    diseaseId: 1,
                    probability: {
                        $cond: {
                            if: {$gte: ["$probability", 1]},
                            then: 100,
                            else: {$ceil: {$multiply: ['$probability', 100]}}
                        }
                    }
                }
            }
        ])
            .sort({probability:-1})
            .limit(10)
            .exec(function (err, d1) {
                if (err) throw err;
                // console.log('ddd:', d1)
                Disease_symptom.populate(d1, {  
                    path: 'diseaseId',
                    select: 'diseaseName'
                },function (err, probabilityList) {
                    if (err) throw err;
                    //记录医生使用某症状的频次
                    async.map(chosenSymptom, function (item, callback) {
                        Frequency.findOne({userId:userId,symptomId:item},function (err, frequency) {
                            if(err) throw err;
                            if(!frequency){
                                Frequency.create({
                                    userId:userId,
                                    symptomId:item,
                                    count:1,
                                    type:enumeration.frequencyType.symptom
                                }, function (err, f1) {
                                    callback(err, f1);
                                });
                            }else {
                                frequency.count++;
                                frequency.save();
                                callback(null,null)
                            }
                        })
                    }, function (err, result) {
                        if (err) {
                            res.send(errors.e115);
                            throw err;
                        }
                        //更新诊断进程为“诊断中”
                        Record.update({_id:req.body.recordId},{
                            progress:enumeration.progress.diagnosing,
                            probabilityList:probabilityList,
                            chosenSymptom:chosenSymptom,
                            chosenDiseaseEntity:req.body.diseaseEntity
                        },function (err, result) {
                            if(err) throw err;
                            if(result.n==0){
                                res.send(errors.e112);
                                return;
                            }
                            // console.log('d1:', probabilityList)
                            res.send(Object.assign({probabilityList:probabilityList},errors.e0));
                        })
                    })
                })
            });
    // });

});

router.post('/diseaseDiagnoseDetail',function (req, res) {
    let diseaseId = req.body.diseaseId;
    //获取已选症状并处理数据
    let chosenSymptom = utils.turnStringToNumberInArray(req.body.chosenSymptom.split('&'));
    // let chosenSymptom = req.body.chosenSymptom;
    Disease_symptom.find({diseaseId:diseaseId,del:false},function (err,d1) {
        if(err) throw err;
        //将所有匹配到的symptomId，放入一个数组
        let symptomArr = [];
        d1.forEach(function (item) {
            symptomArr.push(item.symptomId)
        });
        // console.log('req.body:',req.body)
        // console.log('ccccc:', chosenSymptom)
        // console.log('ssssssss:',symptomArr)
        //用underscore处理symptomArr和chosenSymptom两个数组，匹配情况
        let matchSymptom = _.intersection(symptomArr,chosenSymptom);
        let mismatchSymptom = _.difference(chosenSymptom,symptomArr);
        let otherSymptom = _.difference(symptomArr,chosenSymptom);
         //console.log('s1:', matchSymptom)
         //console.log('s2:', mismatchSymptom)
         //console.log('s3:', otherSymptom)
        //获取症状名称
        async.map([matchSymptom,mismatchSymptom,otherSymptom],function (item, callback) {
            if(item.length==0||!item[0]){
                callback(null,[])
            }else {
                Symptom.populate({symptoms:item},{
                    path:'symptoms',
                    select:'symptom',
                    populate:{
                        path:'symptom',
                        select:'nodeName'
                    }
                },function (err, s1) {
                    if(err) {
                        callback(err,null);
                        throw err;
                    }
                    let symptom1 = [];
                    for (let i = 0; i < s1.symptoms.length; i++) {
                        symptom1[i] = {};
                        symptom1[i].symptomId = s1.symptoms[i]._id;
                        let symptom = '';
                        let ss = s1.symptoms[i].symptom;
                        for (let j = 0; j < ss.length; j++) {
                            symptom += ss[j].nodeName + '；';
                        }
                        symptom1[i].symptom = symptom.substring(0, symptom.lastIndexOf('；'));
                    }
                    callback(null,symptom1)
                });
            }
        },function (err, result) {
            if(err){
                res.send(errors.e115);
                return;
            }
            Disease.findOne({_id:diseaseId},function (err, d2) {
                if(err) throw err;
                res.send(Object.assign({
                    matchSymptom:result[0],
                    mismatchSymptom:result[1],
                    otherSymptom:result[2],
                    antidiastole:d2.antidiastole
                },errors.e0))
            });
        })
    })
});

module.exports = router;

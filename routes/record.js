var express = require('express');
var User = require('../models/User');
var errors = require('../errors');
var Record = require('../models/Record');
var Treatment = require('../models/Treatment');
var enumeration = require('../enumeration');
var router = express.Router();
let settings = require('../settings');

router.post('/record',function (req, res) {
    //console.log(enumeration.progress.waiting,'---------');
    Record.create({
        realName:req.body.realName,
        idCardNo:req.body.idCardNo,
        phoneNo:req.body.phoneNo,
        occupation:req.body.occupation,
        address:req.body.address,
        presentIllnessHistory:req.body.presentIllnessHistory,
        previousIllnessHistory:req.body.previousIllnessHistory,
        chiefComplaint:req.body.chiefComplaint,
        personalIllnessHistory:req.body.personalIllnessHistory,
        familyIllnessHistory:req.body.familyIllnessHistory,
        doctorId:req.body.doctorId,
        age:req.body.age||0,
        gender:req.body.gender
    },function (err, record) {
        if(err) throw err;
        //console.log(record)
        res.send(Object.assign({recordId:record._id},errors.e0));
    })
});

router.put('/record',function (req, res) {
    Record.update({_id:req.body.recordId},{
        realName:req.body.realName,
        idCardNo:req.body.idCardNo,
        phoneNo:req.body.phoneNo,
        occupation:req.body.occupation,
        address:req.body.address,
        presentIllnessHistory:req.body.presentIllnessHistory,
        previousIllnessHistory:req.body.previousIllnessHistory,
        chiefComplaint:req.body.chiefComplaint,
        personalIllnessHistory:req.body.personalIllnessHistory,
        familyIllnessHistory:req.body.familyIllnessHistory,
        age:req.body.age,
        gender:req.body.gender
    },function (err, result) {
        if(err) throw err;
        if(result.n==0){
            res.send(errors.e112);
            return;
        }
        res.send(errors.e0);
    })
});

//获取病历信息
router.get('/record',function (req, res) {
    Record.findOne({_id:req.query.recordId},{
        realName:1,
        gender:1,
        age:1,
        idCardNo:1,
        occupation:1,
        phoneNo:1,
        address:1,
        presentIllnessHistory:1,
        previousIllnessHistory:1,
        personalIllnessHistory:1,
        familyIllnessHistory:1,
        chiefComplaint:1,
        diagnosisSymptom:1,
        diagnosisSyndrome:1,
        treatmentDetail:1,
        diseaseName:1,
        tcmtName:1
    },function (err, record) {
        if(err) throw err;
        if(!record){
            res.send(errors.e112);
            return;
        }
        res.send(Object.assign({record:record},errors.e0));
    })
});

//获取病历信息(生成病历)
router.get('/completeRecord',function (req, res) {
    // console.log('req.query:',req.query)
    Record.findOne({_id:req.query.recordId},{
        chosenSymptom:1,
        chosenSyndrome:1
    })
        .populate({
            path:'chosenSymptom',
            select:'symptom',
            populate:{
                path:'symptom',
                select:'nodeName'
            }
        })
        .populate({
            path:'chosenSyndrome',
            select:'syndrome',
            populate:{
                path:'syndrome',
                select:'nodeName'
            }
        })
        .exec(function (err, r1) {
            if(err) throw err;
            if(!r1){
                res.send(errors.e112);
                return;
            }
            let diagnosisSymptom = [];
            let diagnosisSyndrome = [];
            for(let i=0;i<r1.chosenSymptom.length;i++){
                diagnosisSymptom[i] = {};
                diagnosisSymptom[i].symptomId = r1.chosenSymptom[i]._id;
                let symptomStr = '';
                for(let j=0;j<r1.chosenSymptom[i].symptom.length;j++){
                    symptomStr += r1.chosenSymptom[i].symptom[j].nodeName+'；';
                }
                diagnosisSymptom[i].symptom = symptomStr.substring(0, symptomStr.lastIndexOf('；'));
            }
            for(let i=0;i<r1.chosenSyndrome.length;i++){
                diagnosisSyndrome[i] = {};
                diagnosisSyndrome[i].syndromeId = r1.chosenSyndrome[i]._id;
                let syndromeStr = '';
                for(let j=0;j<r1.chosenSyndrome[i].syndrome.length;j++){
                    syndromeStr += r1.chosenSyndrome[i].syndrome[j].nodeName+'；';
                }
                diagnosisSyndrome[i].syndrome = syndromeStr.substring(0, syndromeStr.lastIndexOf('；'));
            }
            Treatment.findOne({diseaseId:req.query.diseaseId, tcmtId:req.query.tcmtId},function (err, t1) {
                if(err) throw err;
                Record.update({_id:req.query.recordId},{
                    diagnosisSymptom:diagnosisSymptom,
                    diagnosisSyndrome:diagnosisSyndrome,
                    treatmentDetail:t1.treatmentDetail,
                    diseaseId:req.query.diseaseId,
                    tcmtId:req.query.tcmtId
                },function (err, result) {
                    if(err) throw err;
                    Record.findOne({_id:req.query.recordId},{
                        realName:1,
                        gender:1,
                        age:1,
                        idCardNo:1,
                        occupation:1,
                        phoneNo:1,
                        address:1,
                        presentIllnessHistory:1,
                        previousIllnessHistory:1,
                        personalIllnessHistory:1,
                        familyIllnessHistory:1,
                        chiefComplaint:1,
                        diagnosisSymptom:1,
                        diagnosisSyndrome:1,
                        treatmentDetail:1,
                        diseaseName:1,
                        tcmtName:1
                    })
                        //.populate({
                        //    path:'diseaseId',
                        //    select:'diseaseName'
                        //})
                        //.populate({
                        //    path:'tcmtId',
                        //    select:'tcmtName'
                        //})
                        .exec(function (err, record) {
                            if(err) throw err;
                            if(!record){
                                res.send(errors.e112);
                                return;
                            }
                            //更新病历状态
                            Record.update({_id:req.query.recordId},{progress:enumeration.progress.done},function (err, result) {
                                if(err) throw err;
                                res.send(Object.assign({record:record},errors.e0));
                            })
                        })
                });
            })
        });
});

//let a=1494386029409;
//console.log(a.toString().ToDate().ToString("yyyy-MM-dd HH:mm:ss"),'=-=-=-=-')

//个人接诊历史病历列表
router.get('/historyRecordList',function (req, res) {
    Record.count({
        doctorId:req.query.doctorId,
        realName:{$regex: new RegExp(req.query.realName||'', "i")},
        diseaseName:{$regex: new RegExp(req.query.diseaseName||'', "i")},
        tcmtName:{$regex: new RegExp(req.query.tcmtName||'', "i")},
        age:{$gte:parseInt(req.query.minAge||'0'),$lte:parseInt(req.query.maxAge||'1000')},
        gender:req.query.gender||{$in:['男','女','']},
        createTime:{$gte:parseInt(req.query.minDate||'0'),$lte:parseInt(req.query.maxDate||Date.now())},
        progress:enumeration.progress.done
    },function (err, count) {
        if(err) throw err;
        Record.find({
            doctorId:req.query.doctorId,
            realName:{$regex: new RegExp(req.query.realName||'', "i")},
            diseaseName:{$regex: new RegExp(req.query.diseaseName||'', "i")},
            tcmtName:{$regex: new RegExp(req.query.tcmtName||'', "i")},
            age:{$gte:parseInt(req.query.minAge||'0'),$lte:parseInt(req.query.maxAge||'1000')},
            gender:req.query.gender||{$in:['男','女','']},
            createTime:{$gte:parseInt(req.query.minDate||'0'),$lte:parseInt(req.query.maxDate||Date.now())},
            progress:enumeration.progress.done
        },{
            _id: 1,
            realName: 1,
            gender: 1,
            age: 1,
            diseaseName: 1,
            tcmtName: 1,
            createTime: 1
        })
        // .populate([
        //     {
        //         path:'tcmtId',
        //         select:'tcmtName'
        //     },
        //     {
        //         path:'diseaseId',
        //         select:'diseaseName'
        //     }
        // ])
            .sort({createTime:-1})
            .skip((req.query.pageIndex - 1) * settings.pageSize)
            .limit(settings.pageSize)
            .exec(function (err, recordList) {
                if(err) throw err;
                res.send(Object.assign({recordList:recordList},{totalAmount:count},errors.e0));
            })
    })
});

//病案学习列表
router.get('/studyRecordList',function (req, res) {
    Record.count({
        isStudy:true,
        realName:{$regex: new RegExp(req.query.realName||'', "i")},
        diseaseName:{$regex: new RegExp(req.query.diseaseName||'', "i")},
        tcmtName:{$regex: new RegExp(req.query.tcmtName||'', "i")},
        age:{$gte:parseInt(req.query.minAge||'0'),$lte:parseInt(req.query.maxAge||'1000')},
        gender:req.query.gender||{$in:['男','女','']},
        createTime:{$gte:parseInt(req.query.minDate||'0'),$lte:parseInt(req.query.maxDate||Date.now())},
        progress:enumeration.progress.done
    },function (err,count) {
        if(err) throw err;
        Record.find({
            isStudy:true,
            realName:{$regex: new RegExp(req.query.realName||'', "i")},
            diseaseName:{$regex: new RegExp(req.query.diseaseName||'', "i")},
            tcmtName:{$regex: new RegExp(req.query.tcmtName||'', "i")},
            age:{$gte:parseInt(req.query.minAge||'0'),$lte:parseInt(req.query.maxAge||'1000')},
            gender:req.query.gender||{$in:['男','女','']},
            createTime:{$gte:parseInt(req.query.minDate||'0'),$lte:parseInt(req.query.maxDate||Date.now())},
            progress:enumeration.progress.done
        },{
            _id: 1,
            realName: 1,
            gender: 1,
            age: 1,
            diseaseName: 1,
            tcmtName: 1,
            createTime: 1
        })
        // .populate([
        //     {
        //         path:'tcmtId',
        //         select:'tcmtName'
        //     },
        //     {
        //         path:'diseaseId',
        //         select:'diseaseName'
        //     }
        // ])
            .sort({createTime:-1})
            .skip((req.query.pageIndex - 1) * settings.pageSize)
            .limit(settings.pageSize)
            .exec(function (err, recordList) {
                // console.log('styd:',recordList)
                if(err) throw err;
                res.send(Object.assign({recordList:recordList},{totalAmount:count},errors.e0));
            })
    })
});

//待诊断病历
router.get('/waitingRecordList',function (req, res) {
    Record.count({doctorId:req.query.doctorId,progress:enumeration.progress.waiting},function (err, count) {
        if(err) throw err;
        Record.find({doctorId:req.query.doctorId,progress:enumeration.progress.waiting},{
            realName:1,
            gender:1,
            age:1,
            progress:1,
            createTime:1,
        })
            .sort({createTime:-1})
            .skip((req.query.pageIndex - 1) * settings.pageSize)
            .limit(settings.pageSize)
            .exec(function (err,waitingRecordList) {
                if(err) throw err;
                res.send(Object.assign({waitingRecordList:waitingRecordList},{totalAmount:count},errors.e0))
            })
    })
});

//诊断中病历
router.get('/diagnosingRecordList',function (req, res) {
    // console.log('qqq:',req.query)
    Record.count({doctorId:req.query.doctorId,progress:enumeration.progress.diagnosing},function (err, count) {
        if(err) throw err;
        Record.find({doctorId:req.query.doctorId,progress:enumeration.progress.diagnosing},{
            realName:1,
            gender:1,
            age:1,
            progress:1,
            createTime:1,
            chosenSymptom:1,
            chosenSyndrome:1
        })
            .sort({createTime:-1})
            .skip((req.query.pageIndex - 1) * settings.pageSize)
            .limit(settings.pageSize)
            .exec(function (err,diagnosingRecordList) {
                // console.log('dddd:',diagnosingRecordList)
                if(err) throw err;
                res.send(Object.assign({diagnosingRecordList:diagnosingRecordList},{totalAmount:count},errors.e0))
            })
    })
});

module.exports = router;

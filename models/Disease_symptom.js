//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const errors = require('../errors');

//声明Disease_symptom Schema结构
var disease_symptomSchema = new Schema({
    diseaseId: {type: Number, ref: 'Disease'},
    symptomId: {type: Number, ref: 'Symptom'},
    level: {type: Number, default: 0},
    weight: {type: Number, default: 1},
    del: {type: Boolean, default: false},
    totalWeight: {type: Number, default: 0},
    combineParam: {type: Number, default: 0},
    color:{type:String,default:""},
    createTime: {type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
disease_symptomSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Disease_symptom',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Disease_symptom类给予接口
var Disease_symptom = mongoose.model('Disease_symptom', disease_symptomSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Disease_symptom);
Promise.promisifyAll(Disease_symptom.prototype);


/**
 * 增加根据diseaseId查症状
 * @param diseaseId 如果有参则传参，没有参数则用null占位
 * @param level 如果有参则传参，没有参数则用null占位
 * @param callback 如果有参则传参，没有则不传
 */
Disease_symptom.findSymptomByDiseaseId = function (diseaseId, level, callback) {
    Disease_symptom.find({
        diseaseId: diseaseId,
        del:false,
        level: level||{$in: [1, 2]}
    })
        .populate({
            path: 'symptomId',
            select: {
                symptom: 1
            },
            populate: {
                path: 'symptom',
                select: {nodeName: 1}
            }
        })
        .exec(function (err, ds) {
            if (err) throw err;
            if (ds.length==0) {
                callback && callback(errors.e112);
                return;
            }
            let symptomArr = [];
            for (let i = 0; i < ds.length; i++) {
                symptomArr[i] = {};
                symptomArr[i].symptomId = ds[i].symptomId._id;
                let symptom = '';
                let ss = ds[i].symptomId.symptom;
                for (let j = 0; j < ss.length; j++) {
                    symptom += ss[j].nodeName + '；';
                }
                symptomArr[i].symptom = symptom.substring(0, symptom.lastIndexOf('；'));
            }
            callback && callback(null, symptomArr);
        })
};
module.exports = Disease_symptom;


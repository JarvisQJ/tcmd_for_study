//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Record Schema结构
var recordSchema = new Schema({
    realName: {type: String, default: ""},
    idCardNo: {type: String, default: ""},
    age: {type: Number, default: 0},
    gender: {type: String, default: ""},
    phoneNo: {type: String, default: ""},
    occupation: {type: String, default: ""},
    address: {type: String, default: ""},
    presentIllnessHistory: {type: String, default: ""},
    previousIllnessHistory: {type: String, default: ""},
    personalIllnessHistory: {type: String, default: ""},
    familyIllnessHistory: {type: String, default: ""},
    chiefComplaint: {type: String, default: ""},
    doctorId: {type: Number, default: 0,ref:'User'},
    // diseaseId: {type: Number, default: 0,ref:'Disease'},
    // tcmtId: {type: Number, default: 0,ref:'Tcmt'},
    diseaseName: {type: String, default: ''},
    tcmtName: {type: String, default: ''},
    chosenSymptom: [{type: Number, ref: 'Symptom'}],
    chosenSyndrome: [{type: Number, ref: 'Syndrome'}],
    diagnosisSymptom: {type: Array, default: []},
    diagnosisSyndrome: {type: Array, default: []},
    probabilityList: {type: Array, default: []},
    progress:{type:String,default:'待诊断'},
    treatmentDetail:{type:String,default:''},
    isStudy:{type:Boolean,default:false},
    chosenDiseaseEntity:{type:String,default:''},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
recordSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Record',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Record类给予接口
var Record = mongoose.model('Record', recordSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Record);
Promise.promisifyAll(Record.prototype);

module.exports = Record;


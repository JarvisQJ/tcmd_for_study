//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Disease Schema结构
var diseaseSchema = new Schema({
    diseaseName: {type: String, default: ""},
    diseaseEntity: {type: String, default: ""},
    // diseaseType: {type: String, default: ""},
    antidiastole: {type: Array, default: []},
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
diseaseSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Disease',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Disease类给予接口
var Disease = mongoose.model('Disease', diseaseSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Disease);
Promise.promisifyAll(Disease.prototype);

module.exports = Disease;


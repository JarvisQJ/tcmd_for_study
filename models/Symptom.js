//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Symptom Schema结构
var symptomSchema = new Schema({
    symptom: [{type: Number, ref: 'Assortment'}],
    del: {type: Boolean, default: false},
    createTime: {type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
symptomSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Symptom',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Symptom类给予接口
var Symptom = mongoose.model('Symptom', symptomSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Symptom);
Promise.promisifyAll(Symptom.prototype);

module.exports = Symptom;


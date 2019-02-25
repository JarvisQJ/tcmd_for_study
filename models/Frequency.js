//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Frequency Schema结构
var frequencySchema = new Schema({
    userId: {type: Number, ref:'User'},
    symptomId: {type: Number, ref:'Symptom'},
    syndromeId: {type: Number, ref:'Syndrome'},
    count: {type: Number, default: 0},
    type: {type: String, default: ''},
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
frequencySchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Frequency',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Frequency类给予接口
var Frequency = mongoose.model('Frequency', frequencySchema);

var Promise = require('bluebird');
Promise.promisifyAll(Frequency);
Promise.promisifyAll(Frequency.prototype);

module.exports = Frequency;


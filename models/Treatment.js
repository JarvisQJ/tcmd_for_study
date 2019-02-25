//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Treatment Schema结构
var treatmentSchema = new Schema({
    treatmentName: {type: String, default: ""},
    diseaseId: {type: Number, ref:'Disease'},
    tcmtId: {type: Number, ref:'Tcmt'},
    treatmentDetail: {type: String, default: ""},
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
treatmentSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Treatment',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Treatment类给予接口
var Treatment = mongoose.model('Treatment', treatmentSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Treatment);
Promise.promisifyAll(Treatment.prototype);

module.exports = Treatment;


//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Disease_tcmd Schema结构
var disease_tcmdSchema = new Schema({
    diseaseId: {type: Number, default: ""},
    tcmtId: {type: Number, default: ""},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
disease_tcmdSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Disease_tcmd',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Disease_tcmd类给予接口
var Disease_tcmd = mongoose.model('Disease_tcmd', disease_tcmdSchema);

module.exports = Disease_tcmd;


//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Tcmt Schema结构
var tcmtSchema = new Schema({
    tcmtName: {type: String, default: ""},
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
tcmtSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Tcmt',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Tcmt类给予接口
var Tcmt = mongoose.model('Tcmt', tcmtSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Tcmt);
Promise.promisifyAll(Tcmt.prototype);

module.exports = Tcmt;


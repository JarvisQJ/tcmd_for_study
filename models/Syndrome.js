//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Syndrome Schema结构
var syndromeSchema = new Schema({
    syndrome: [{type: Number, ref: 'Type'}],
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
syndromeSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Syndrome',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Syndrome类给予接口
var Syndrome = mongoose.model('Syndrome', syndromeSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Syndrome);
Promise.promisifyAll(Syndrome.prototype);

module.exports = Syndrome;


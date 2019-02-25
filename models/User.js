//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明User Schema结构
var userSchema = new Schema({
    realName: {type: String, default: ""},
    doctorTitle: {type: String, default: ""},
    age: {type: Number, default: 0},
    gender: {type: String, default: ""},
    phoneNo: {type: String, default: ""},
    password: {type: String, default: ""},
    type: {type: String, default: ""},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
userSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'User',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将User类给予接口
var User = mongoose.model('User', userSchema);

var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;


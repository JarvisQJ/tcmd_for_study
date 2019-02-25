//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Type Schema结构
var typeSchema = new Schema({
    nodeName: {type: String, default: ""},
    parentId: {type: Number, default: 0},
    del: {type: Boolean, default: false},
    isLastNode: {type: Boolean, default: false},
    syndromeId: {type: Number, default: 0},//绑定的分型ID（只有最后节点会绑定）
    pedigree: {type: Array},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
typeSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Type',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

//将Type类给予接口
var Type = mongoose.model('Type', typeSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Type);
Promise.promisifyAll(Type.prototype);

module.exports = Type;


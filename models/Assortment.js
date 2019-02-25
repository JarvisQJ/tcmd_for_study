//引入数据库操作模块
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Assortment Schema结构
var assortmentSchema = new Schema({
    nodeName: {type: String, default: ""},
    parentId: {type: Number, default: 0},
    del: {type: Boolean, default: false},
    isLastNode: {type: Boolean, default: false},
    symptomId: {type: Number, default: 0},//绑定的症状ID（只有最后节点会绑定）
    pedigree: {type: Array},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
assortmentSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Assortment',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

//将Assortment类给予接口
var Assortment = mongoose.model('Assortment', assortmentSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Assortment);
Promise.promisifyAll(Assortment.prototype);

module.exports = Assortment;


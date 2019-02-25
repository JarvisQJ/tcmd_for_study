//引入数据库操作模块1
var autoIncrement = require('mongoose-auto-increment')//自增模块
    ;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//声明Tcmt_syndrome Schema结构
var tcmt_syndromeSchema = new Schema({
    tcmtId: {type: Number, ref:'Tcmt'},
    syndromeId: {type: Number, ref:'Syndrome'},
    weight: {type: Number, default: 1},
    totalWeight: {type: Number, default: 0},
    del: {type: Boolean, default: false},
    createTime:{type: Number, default: Date.now}
});

//初始化自增模块
autoIncrement.initialize(mongoose.connection);

//自增键
tcmt_syndromeSchema.plugin(autoIncrement.plugin, {
    //自增ID配置
    model: 'Tcmt_syndrome',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


//将Tcmt_syndrome类给予接口
var Tcmt_syndrome = mongoose.model('Tcmt_syndrome', tcmt_syndromeSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Tcmt_syndrome);
Promise.promisifyAll(Tcmt_syndrome.prototype);

/**
 * 根据tcmtId查该分型的症候
 * @param callback 如果有参则传参，没有则不传
 * @param tcmtId 必需
 */
Tcmt_syndrome.findSyndromeByTcmtId = function (tcmtId,callback) {
    Tcmt_syndrome.find({
        tcmtId: tcmtId,
        del:false,
    })
        .populate({
            path: 'syndromeId',
            select: {
                syndrome: 1
            },
            populate: {
                path: 'syndrome',
                select: {nodeName: 1}
            }
        })
        .exec(function (err, ts) {
            if (err) throw err;
            if (ts.length==0) {
                callback && callback(errors.e112);
                return;
            }
            let syndromeArr = [];
            for (let i = 0; i < ts.length; i++) {
                syndromeArr[i] = {};
                syndromeArr[i].syndromeId = ts[i].syndromeId._id;
                let syndrome = '';
                let ss = ts[i].syndromeId.syndrome;
                for (let j = 0; j < ss.length; j++) {
                    syndrome += ss[j].nodeName + '；';
                }
                syndromeArr[i].syndrome = syndrome.substring(0, syndrome.lastIndexOf('；'));
            }
            callback && callback(null, syndromeArr);
        })
};

module.exports = Tcmt_syndrome;


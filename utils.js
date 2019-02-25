/**
 * @type {*|exports|module.exports}
 * 工具类，通用功能
 */
var setting = require('./settings'),
    http = require("http"),
    error = require('./errors'),
    fs = require('fs');

//主要用来取socket内置的json数据结构长度
exports.getJsonLength = function (jsonData) {
    //linux下面的io.sockets.adapter.rooms结构没有带length属性，但是windows下面有length属性
    var jsonLength = 0;
    for (var item in jsonData)
        jsonLength++;
    return jsonLength;
};

//将origin中的键值对赋给target
exports.combineJson = function (origin, target) {
    for (var p in origin) {
        //var name=p;//属性名称
        //var value=origin[p];//属性对应的值
        target[p] = origin[p];
    }
    return target;

};

//将数组中的字符串转为数字，如[ '26', '27', '34', '35' ]，转为[ 26, 27, 34, 35 ]
exports.turnStringToNumberInArray = function (target) {
    let newArray = [];
    target.forEach(function (item) {
        newArray.push(parseInt(item))
    });
    return newArray;
};


//将毫秒数转化为时长
exports.MillisecondToDate = function (msd) {
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            time = "00:" + parseInt(time / 60.0).FullZero() + ":" + (parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60)).FullZero();
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0).FullZero() + ":" + (parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60)).FullZero() + ":" +
                (parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60)).FullZero();
        } else {
            time = "00:00:" + parseInt(time).FullZero();
        }
    }
    return time;
};

Number.prototype.FullZero = function () {
    return this > 10 ? this : "0" + this;
};


exports.getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

/*
 时间字符串转时间,支持时间戳、字符串等
 */
String.prototype.ToDate = function () {
    var seed = this.replace("/Date(", "").replace(")/", "");
    seed = /^\d*$/.test(seed) ? parseInt(seed) : seed;
    return new Date(seed);
};


/*
 时间格式化
 格式 YYYY/yyyy/YY/yy 表示年份
 MM/M 月份
 W/w 星期
 dd/DD/d/D 日期
 hh/HH/h/H 时间
 mm/m 分钟
 ss/SS/s/S 秒
 */
Date.prototype.ToString = function (str) {
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth() + 1);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
};




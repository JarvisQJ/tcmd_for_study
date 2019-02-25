/**
 *创建数据库连接
 * 该模块只会被加载一次，一直使用相同的实例
 */
//引入连接配置的模块
var setting = require("./settings");
//引入mongoose 模块对mongodb进行操作
var mongoose = require('mongoose');

var db_url = "mongodb://" + setting.db_host + ":" + setting.db_port + "/" + setting.db_name;

var recon = true;

function getConnect() {

    var opts = {
        db: {
            native_parser: true
        },
        server: {
            poolSize: 3,
            auto_reconnect: true
        },
        user: setting.db_user,
        pass: setting.db_pwd
    };
    console.log("db_Url:" + db_url);
    mongoose.connect(db_url, opts);

    var dbcon = mongoose.connection;

    dbcon.on('error', function (error) {
        console.log('connection error,请检查服务器上mongodb数据库是否已启动');
        dbcon.close();
        reConnect('服务器异常，重连...');
    });

    //监听关闭事件并重连
    dbcon.on('disconnected', function () {
        console.log('disconnected');
        dbcon.close();
    });
    dbcon.on('open', function () {
        console.log('connection success open');
        recon = true;
    });
    dbcon.on('close', function (err) {
        console.log('closed');
        reConnect('*');
    });
    function reConnect(msg) {
        console.log('reConnect' + msg);
        if (recon) {
            console.log('reConnect-**');
            dbcon.open(setting.db_host, setting.db_name, setting.db_port, opts, function () {
                console.log('closed-opening');
            });
            recon = false;
            console.log('reConnect-***');
        }
        console.log('reConnect-end');
    }

    return dbcon;

}

exports.getConnect = getConnect;//包含到module.exports对象中,
// 如果module.exports中包含属性或方法则export.XX将被忽略
// Module.exports才是真正的接口，exports只不过是它的一个辅助工具。
// 最终返回给调用的是Module.exports而不是exports。
// 所有的exports收集到的属性和方法，都赋值给了Module.exports。
// 当然，这有个前提，就是Module.exports本身不具备任何属性和方法。
// 如果，Module.exports已经具备一些属性和方法，那么exports收集来的信息将被忽略。
//module.exports = mongoose;//直接导出这个对象
exports.mongoose = mongoose;
exports.url = db_url;

/**
 * 菜单信息
 * 2016-5-10 14:53:25
 * 余剑傲 
 */

module.exports = function () {
    
    //mongoose
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;//图表类
    var autoIncrement = require('mongoose-auto-increment');//自增模块
    
    //定义表
    var navigationSchema = new Schema({
        title: String,//标题
        name: String,//名称
        parent: {
            type: Number, 
            ref: "Navigation"//关联navigation表
        },//父节点
        actions: [String],//操作
        isDirectory: Boolean,//是否是目录
        linkUrl: String,//链接地址
        sort: Number,//排序
        isShow: Boolean,//是否显示
        createTime: {
            type: Date , 
            default: Date.now
        }//创建时间
    });
    
    //自增键
    navigationSchema.plugin(autoIncrement.plugin, {
        //自增ID配置
        model: 'Navigation',
        field: '_id',
        startAt: 1,
        incrementBy: 1
    });
    
    //定义模型
    var Navigation = mongoose.model('Navigation', navigationSchema, "navigation");
    
    //输出
    return Navigation;
}();


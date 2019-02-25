var express = require("express"),
    _ = require("underscore"),
    extend = require('util')._extend,
    router = express.Router();//路由
   let User=require('../models/User');

/**
 *登录检查 
// */
//router.use(function (req, res, next) {
//
//    if (req.url == "/loginPage") {
//        console.log(req.session.user,'-----------------有session--------');
//
//        // if (req.session.user) {
//        //     console.log(req.session.user,'-----------------1111--------');
//        //     res.redirect("web/index");
//        //     return;
//        // }
//
//    } else {
//        //非登录页且未登录过则跳转登录页
//
//        if (!req.session.user) {
//            // console.log(req.url,'-----req.originalUrl-----')
//            // console.log(req.session.user,'-----------------没有session--------');
//            res.redirect("/loginPage");
//            return;
//        }
//    }
//
//
//    next();
//});

module.exports = router;
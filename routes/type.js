var express = require('express');
var User = require('../models/User');
var errors = require('../errors');
var utils = require('../utils');
var enumeration = require('../enumeration');
var router = express.Router();
const Type = require('../models/Type');

//获取某节点的子节点
router.get('/childType', function (req, res) {
    Type.find(
        {
            parentId: req.query.parentId,
            del:false
        },
        {
            nodeName:1,
            isLastNode:1,
            syndromeId:1
        })
        .exec(function (err, children) {
            if(err) throw err;
            if(!children){
                res.send(errors.e112);
                return;
            }
            res.send(utils.combineJson(errors.e0,{children:children}))
        })
});

module.exports = router;

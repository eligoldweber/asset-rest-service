var express = require('express');
var router = express.Router();
var request = require('request');
//var https = require('https');

var config = require('../config/config.js');
var AssetController = require('../controllers/AssetController');




// GET
router.get('/:type/:model', function(req, res, next) {

AssetController.getAssets(req,function(status, message){
      res.status(status).send(message);
      console.log("response :" + AssetController.getModel()[0].uri +  " ; " + message[0].model);

    });

});

//POST
router.post('/demo/:type/:model', function(req, res, next) {

AssetController.processAsset(req,function(status, message){
      res.status(status).send(message);
      console.log("response :" + AssetController.getModel()[0].uri +  " ; " + message[0].model);
    });

});




module.exports = router;

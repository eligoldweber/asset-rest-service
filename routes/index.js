var express = require('express');
var router = express.Router();
var request = require('request');
//var https = require('https');

var config = require('../config/config.js');
var AssetController = require('../controllers/AssetController');




// GET 
// example http call: https://asset-rest-service.run.aws-usw02-pr.ice.predix.io/tags/sensor1

/*GET /tags/sensor1 HTTP/1.1
Host: asset-rest-service.run.aws-usw02-pr.ice.predix.io
Content-Type: application/json
Authorization: YXBwLWNsaWVudC1pZDpzZWNyZXQ=
*/

router.get('/:type/:model', function(req, res, next) {

AssetController.getAssets(req,function(status, message){
      res.status(status).send(message);
      console.log("response :" + AssetController.getModel()[0].uri +  " ; " + message[0].model);

    });

});

//POST
// example http call: https://asset-rest-service.run.aws-usw02-pr.ice.predix.io/demo/sensors/Grove_moisturesensor_1_4-11

/*
POST /demo/sensors/Grove_moisturesensor_1_4-11 HTTP/1.1
Host: asset-rest-service.run.aws-usw02-pr.ice.predix.io
Content-Type: application/json
Authorization: YXBwLWNsaWVudC1pZDpzZWNyZXQ=
Cache-Control: no-cache


  {
    "devices":"/devices/aaa",
    "kits" : "/kits/bbb"
  }
*/

router.post('/demo/:type/:model', function(req, res, next) {

AssetController.processAsset(req,function(status, message){
      res.status(status).send(message);
      console.log("response :" + AssetController.getModel()[0].uri +  " ; " + message[0].model);
    });

});




module.exports = router;

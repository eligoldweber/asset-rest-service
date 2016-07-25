var express = require('express');
var router = express.Router();
var request = require('request');
//var https = require('https');

var config = require('../config/config.js');
var UAAController = require('../controllers/UAAController');
var uaaController = new UAAController();
//var uaaTemp = '';
//var TimeSeriesController = require('../controllers/TimeSeriesController');
//var AssetController = require('../controllers/AssetController');
var AssetControllerTest1 = require('../controllers/AssetControllerTest1');



///new////


// GET
router.get('/:type/:model', function(req, res, next) {

AssetControllerTest1.getAssets(req,function(status, message){
      res.status(status).send(message);
      console.log("blah test :" + AssetControllerTest1.getModel()[0].uri +  " ; " + message[0].model);

    });






});

router.get('/TS/uuid/eli/:name', function(req, res, next) {
console.log("TS HIT??");
AssetControllerTest1.getTS(req,function(status, message){
      res.send(JSON.stringify(message));
      console.log("blah test " + message);

    });






});

router.get('/kitAsset', function(req, res, next) {
console.log("kitAsset HIT??");
AssetControllerTest1.postKitAsset(req,function(status, message){
      res.send(JSON.stringify(message));
      console.log("blah test " + message);

    });






});

//test
router.post('/demo/:type/:model', function(req, res, next) {

AssetControllerTest1.getAssetsTEST(req,function(status, message){
      res.status(status).send(message);
      console.log("blah test :" + AssetControllerTest1.getModel()[0].uri +  " ; " + message[0].model);
      // AssetControllerTest1.getTSdEMO("aasdfasdf");
      // console.log(AssetControllerTest1.getTScheck() + " ^&^&^^&&^^^&&^^")
    });






});




module.exports = router;

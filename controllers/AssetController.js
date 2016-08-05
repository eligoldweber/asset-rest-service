var WebSocket = require('ws');
var request = require('request');
var uuid = require('node-uuid');

var UAAController = require('../controllers/UAAController');
var uaaController = new UAAController();

var UAAControllerTS = require('../controllers/UAAControllerTS');
var uaaControllerTS = new UAAControllerTS();

//var PayloadValidator = require('../controllers/PayloadValidator');

var config = require('../config/config.js');

function AssetController() {
  this.headers = {};
  this.model = null;
  this.check = null;
  this.date = new Date();
  this.access_token = null;

  // Fetch a token and set headers
  var self = this;
  uaaController.fetchToken(function(){
    self.setHeaders();
  });
  uaaControllerTS.fetchTokenTS(function(){
    console.log("UAA " + uaaControllerTS.getTokenTS());
  });
}

AssetController.prototype.setHeaders = function(){ //not used currently but could be useful
  this.headers = {
    'Authorization': 'Bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
    'Content-Type' : 'application/json'
  };
};

AssetController.prototype.getAssets = function(req, callback) { // simple test method to that returns a single asset depending on req
  console.log("[INFO] Fetching asset...(B TOKEN = ) ");
  var self = this;

  var uuid1 = uuid.v1();
  var options = {
  url: config.asset.ingestUri+'/'+ req.params.type + '/' + req.params.model,
  //method: 'GET',
  headers: {
    'Authorization': 'bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
  'Content-Type' : 'application/json'
  }
};
uaaController.fetchToken(function(){
    self.setHeaders();
  });
console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type + '/' + req.params.model);

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      self.model = JSON.parse(response.body);
      //self.model  = JSON.stringify(self.modelA);
      self.model[0].uri = self.model[0].uri + "*" + uuid1;
      console.log("[INFO] Token fetched (expires in " +body + " seconds)." +self.model[0].uri +  "  !" + " dfs " +self.model[0].model); 
    callback(200, self.model);
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
    }
  });
};

// /////
AssetController.prototype.processAsset = function(req, callback) { // main function
  var self = this;
var nameLength = req.params.model.length;
var n = req.params.model.substring(0,req.params.model.indexOf('-'));
self.getUAA(function(localUAA){         //get local asset registry UAA
  var uuid1 = uuid.v1(); //create UUID
  var options = {
  url: config.asset.ingestUri+'/'+ req.params.type + '/' + n,
  //method: 'GET',
  headers: {
    'Authorization': 'bearer ' + localUAA,
    'Predix-Zone-Id': config.asset.zoneId,
  'Content-Type' : 'application/json'
  }
};

console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type + '/' + n);
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      self.model = JSON.parse(response.body); //create new asset model
      self.model[0].uri = "/testEli/"+self.model[0].uri.substr(self.model[0].uri.indexOf('G')) + "-uuid-" + uuid1 + "ELIELIELI"; //change this for permanent URI !!!
      self.model[0]["edge-alias"] = req.params.model;
      self.model[0].sensors = "/sensors/"+n;
      self.model[0].devices = req.body.devices;
      self.model[0].kits =  req.body.kits;
self.getUAAGlobal(function(UaaGlobal){
      self.checkTS(self.model[0].uri,UaaGlobal,function(temp){ //check uri vs global timeseries
      
        if(temp == 0){
          self.postGlobalAsset(self.model,localUAA,function(temp){ //post to global asset (right now it is using local UAA so not to mess up any important global assets)
              console.log("[TRYING TO POST..........]");
          });
          callback(200, self.model); //return updated asset
        }else{
          callback(400, "NOT UNIQUE " + temp);
        }
    });
  });
   
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
    }
  });
   });
};

AssetController.prototype.checkTS = function(m,uaa, callback) { //check vs ts, with passed in UAA
  console.log("[INFO] Fetching TS... ");
  var self = this;

  var options = { method: 'POST',
 url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
 headers: 
  { 
    'cache-control': 'no-cache',
    'predix-zone-id': 'ad85c18d-6ad0-463c-a4b2-175567ffa7ef',
    'content-type': 'application/json',
    authorization: 'Bearer ' + uaa }, 
 body: { start: '1y-ago', tags: [ { name: m } ] },
 json: true };

request(options, function (error, response, body) {
 if (error) throw new Error(error);
 console.log(body.tags[0].stats.rawCount);
 this.check = body.tags[0].stats.rawCount;
 callback(body.tags[0].stats.rawCount); //if body count is 0 then the uri is unique
});
};


AssetController.prototype.postGlobalAsset = function(req,uaa, callback) { //post to global asset with passed in UAA
  var options = { method: 'POST',
  url: 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/testEli',
  headers: 
   { 
     'cache-control': 'no-cache',
      authorization: 'Bearer ' + uaa,
     'content-type': 'application/json;charset=utf-8',
     'predix-zone-id': '10a21c94-1c44-44dc-86a3-9a1c7d50576e' },
  body: JSON.stringify(req) };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  callback(body);
});
};

AssetController.prototype.getUAA = function(callback) { //get 'local' UAA
var options = { method: 'GET',
  url: config.uaa.issuerId,
  qs: { grant_type: 'client_credentials' },
  headers: 
   { 'cache-control': 'no-cache',
     authorization: 'Basic YXBwLWNsaWVudC1pZDpzZWNyZXQ=' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  callback(JSON.parse(body).access_token);
});
};


AssetController.prototype.getUAAGlobal = function(callback) { //get global uaa
var options = { method: 'GET',
  url: 'https://9bf4a9ba-79b1-4055-8282-096d8d478941.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
  qs: { grant_type: 'client_credentials' },
  headers: 
   { 'cache-control': 'no-cache',
     authorization: 'Basic cHJlZGl4X3RyYW5zZm9ybV8xOnByM2RpeEtpdHNSMGNr' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  callback(JSON.parse(body).access_token);
});
};

////////////////


AssetController.prototype.getModel = function() {
  return this.model;
};
AssetController.prototype.getTScheck = function() {
  return this.check;
};

module.exports = new AssetController();

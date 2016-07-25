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

AssetController.prototype.setHeaders = function(){
  this.headers = {
    'Authorization': 'Bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
    'Content-Type' : 'application/json'
  };
};

AssetController.prototype.getAssets = function(req, callback) {
  console.log("[INFO] Fetching asset...(B TOKEN = ) ");
  var self = this;

  var uuid1 = uuid.v1();
console.log("uuid = " + uuid1);    // -> '02a2ce90-1432-11e1-8558-0b488e4fc115')
  var options = {
  url: config.asset.ingestUri+'/'+ req.params.type + '/' + req.params.model,
  //method: 'GET',
  headers: {
    //'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3MGM0NjA3MS05MTk3LTQ2MDYtOTBmYi02YTJiNGVkM2QwNjEiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY4MjQxNzI3LCJleHAiOjE0NjgyODQ5MjcsImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.vZvSnPKM3C-9npNcimTYeQRpzA9A8JARDxINX8rzPvxjNRXrQaASAEQkUY2YNhVez3aNoS4tQBFBPra8b1Z_3Wj26NDcCcvfuxrthAVaeGwKiPJVwIXP3QWyLzWrdWPzK7QMldpg5CdAva3HBfdGeiijMgesPoK4qX5lSJVCjOX1KIpX-_8GfLxjrHn1SPD_2DW04LY_vcKcsAI4ls2RRp4JVqKpeQYmA6zb1L1OB2KxPKWmHPoXNUEdNZx0u3QvMMe4fjqOADh-6i8mZHZca3moPewmulvvvC0z-w4hAa-Hcsh9a3jio0vHR4NDYJJ84uuGkFxtirei-yR2Dw2tVg',
    'Authorization': 'bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
  'Content-Type' : 'application/json'
  }
};
console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type + '/' + req.params.model);
  // console.log(JSON.stringify(options, null, 2));

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("what is going on????");
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
AssetController.prototype.processAsset = function(req, callback) {
  console.log("[INFO] Fetching asset...(B TOKEN = ) ************ ");
  var self = this;
var nameLength = req.params.model.length;
//var n = req.params.model.substring(0,nameLength-2);
var n = req.params.model.substring(0,req.params.model.indexOf('-'));


  var uuid1 = uuid.v1();
  console.log("uuid = " + uuid1);    // -> '02a2ce90-1432-11e1-8558-0b488e4fc115')
  var options = {
  url: config.asset.ingestUri+'/'+ req.params.type + '/' + n,
  //method: 'GET',
  headers: {
    //'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3MGM0NjA3MS05MTk3LTQ2MDYtOTBmYi02YTJiNGVkM2QwNjEiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY4MjQxNzI3LCJleHAiOjE0NjgyODQ5MjcsImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.vZvSnPKM3C-9npNcimTYeQRpzA9A8JARDxINX8rzPvxjNRXrQaASAEQkUY2YNhVez3aNoS4tQBFBPra8b1Z_3Wj26NDcCcvfuxrthAVaeGwKiPJVwIXP3QWyLzWrdWPzK7QMldpg5CdAva3HBfdGeiijMgesPoK4qX5lSJVCjOX1KIpX-_8GfLxjrHn1SPD_2DW04LY_vcKcsAI4ls2RRp4JVqKpeQYmA6zb1L1OB2KxPKWmHPoXNUEdNZx0u3QvMMe4fjqOADh-6i8mZHZca3moPewmulvvvC0z-w4hAa-Hcsh9a3jio0vHR4NDYJJ84uuGkFxtirei-yR2Dw2tVg',
    'Authorization': 'bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
  'Content-Type' : 'application/json'
  }
};
console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type + '/' + n);
  // console.log(JSON.stringify(options, null, 2));

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("what is going on????");
      self.model = JSON.parse(response.body);
      //self.model  = JSON.stringify(self.modelA);
      self.model[0].uri = "/test/"+self.model[0].uri.substr(self.model[0].uri.indexOf('G')) + "-uuid-" + uuid1; //tags goes here
      self.model[0]["edge-alias"] = req.params.model;
      self.model[0].sensors = "/sensors/"+n;
      self.model[0].devices = req.body.devices;
      self.model[0].kits =  req.body.kits;
      console.log("[INFO] Token fetched (expires in " +body + " seconds)." +self.model[0].uri +  "  !" + " dfs " +self.model[0].devices + " :: "  + self.model[0].kits); 
      //TRY TIMESERIES CALL

      self.checkTS(self.model[0].uri,function(temp){
      
       //console.log("TS TS TS TS TEST " + temp + self.check);
        if(temp == 0){
          self.postGlobalAsset(self.model,function(temp){
              console.log("[TRYING TO POST..........]");
          });
          callback(200, self.model);
        }else{
          callback(400, "NOT UNIQUE " + temp);
        }
    });
   
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
    }
  });
};

AssetController.prototype.checkTS = function(m, callback) {
  console.log("[INFO] Fetching TS... ");
  var self = this;

 // var uuid1 = uuid.v1();
//console.log(' [INFO] Bearer ' + uaaControllerTS.getTokenTS() );    // -> '02a2ce90-1432-11e1-8558-0b488e4fc115')
  var options = { method: 'POST',
 url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
 headers: 
  { 
    'cache-control': 'no-cache',
    'predix-zone-id': 'ad85c18d-6ad0-463c-a4b2-175567ffa7ef',
    'content-type': 'application/json',
    authorization: 'Bearer ' + uaaControllerTS.getTokenTS() }, 
 body: { start: '1y-ago', tags: [ { name: m } ] },
 json: true };

request(options, function (error, response, body) {
 if (error) throw new Error(error + " hwew");

 console.log(body);
 // console.log(JSON.parse(body).tags);
 // console.log(JSON.stringify(body).tags[0]);
 //var jsonObj = JSON.parse(body);
 console.log(body.tags[0].stats.rawCount);
 this.check = body.tags[0].stats.rawCount;
 callback(body.tags[0].stats.rawCount);
});
};


AssetController.prototype.postGlobalAsset = function(req, callback) {
  console.log("in piost " + JSON.stringify(req));
  var options = { method: 'POST',
  url: 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/test',
  headers: 
   { 
     'cache-control': 'no-cache',
      authorization: 'Bearer ' + uaaController.getToken(),
     'content-type': 'application/json;charset=utf-8',
     'predix-zone-id': '10a21c94-1c44-44dc-86a3-9a1c7d50576e' },
  body: JSON.stringify(req) };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  callback(body);
});
};



AssetController.prototype.getModel = function() {
  return this.model;
};
AssetController.prototype.getTScheck = function() {
  return this.check;
};

module.exports = new AssetController();

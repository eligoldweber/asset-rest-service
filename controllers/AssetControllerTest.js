var WebSocket = require('ws');
var request = require('request');
//var uuid = require('node-uuid');

var UAAController = require('../controllers/UAAController');
var uaaController = new UAAController();

//var PayloadValidator = require('../controllers/PayloadValidator');

var config = require('../config/config.js');

function AssetController() {
  this.headers = {};
  this.model = null;
  this.date = new Date();
  this.access_token = null;

  // Fetch a token and set headers
  var self = this;
  uaaController.fetchToken(function(){
    self.setHeaders();
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
  console.log("[INFO] Fetching asset...");
  var self = this;

 // var uuid1 = uuid.v1();
//console.log("uuid = " + uuid1);    // -> '02a2ce90-1432-11e1-8558-0b488e4fc115')
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
      //self.model[0].uri = self.model[0].uri + "-" + uuid1;
      console.log("[INFO] Token fetched (expires in " +body + " seconds)." +self.model[0].uri +  "  !" + " dfs " +self.model[0].model); 
    callback(200, self.model);
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
    }
  });
};

//new call
// AssetController.prototype.getAssetAlias = function(req, callback) {
//   console.log("[INFO] Fetching asset...");
//   var self = this;

//   var options = {
//   url: config.asset.ingestUri+'/'+ req.params.type + '?filter=edge-alias='+req.params.alias,
//   //method: 'GET',
//   headers: {
//     //'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3MGM0NjA3MS05MTk3LTQ2MDYtOTBmYi02YTJiNGVkM2QwNjEiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY4MjQxNzI3LCJleHAiOjE0NjgyODQ5MjcsImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.vZvSnPKM3C-9npNcimTYeQRpzA9A8JARDxINX8rzPvxjNRXrQaASAEQkUY2YNhVez3aNoS4tQBFBPra8b1Z_3Wj26NDcCcvfuxrthAVaeGwKiPJVwIXP3QWyLzWrdWPzK7QMldpg5CdAva3HBfdGeiijMgesPoK4qX5lSJVCjOX1KIpX-_8GfLxjrHn1SPD_2DW04LY_vcKcsAI4ls2RRp4JVqKpeQYmA6zb1L1OB2KxPKWmHPoXNUEdNZx0u3QvMMe4fjqOADh-6i8mZHZca3moPewmulvvvC0z-w4hAa-Hcsh9a3jio0vHR4NDYJJ84uuGkFxtirei-yR2Dw2tVg',
//     'Authorization': 'bearer ' + uaaController.getToken(),
//     'Predix-Zone-Id': config.asset.zoneId,
//   'Content-Type' : 'application/json'
//   }
// };
// console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type + '?filter=edge-alias='+req.params.alias);
//   // console.log(JSON.stringify(options, null, 2));

//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       self.model = JSON.parse(response.body);
//       //self.model  = JSON.stringify(self.modelA);
//       console.log("[INFO] Token fetched (expires in " +body + " seconds)." +self.model[0].uri +  "  !" + " dfs " +self.model[0].kit); 
//     //callback(200, JSON.parse(response.body));
//     callback(200, self.model);
//     } else if (error || response.statusCode != 200) {
//       console.log("[INFO] Error fetching token: " + response.statusCode + " error = " + error );
//     }
//   });
// };
//end new call

AssetController.prototype.postAsset = function(req, callback) {
  console.log("[INFO] Fetching asset...");
  var self = this;

  var options = {
  url: config.asset.ingestUri+'/'+ req.params.type,
  headers: {
    //'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3MGM0NjA3MS05MTk3LTQ2MDYtOTBmYi02YTJiNGVkM2QwNjEiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY4MjQxNzI3LCJleHAiOjE0NjgyODQ5MjcsImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.vZvSnPKM3C-9npNcimTYeQRpzA9A8JARDxINX8rzPvxjNRXrQaASAEQkUY2YNhVez3aNoS4tQBFBPra8b1Z_3Wj26NDcCcvfuxrthAVaeGwKiPJVwIXP3QWyLzWrdWPzK7QMldpg5CdAva3HBfdGeiijMgesPoK4qX5lSJVCjOX1KIpX-_8GfLxjrHn1SPD_2DW04LY_vcKcsAI4ls2RRp4JVqKpeQYmA6zb1L1OB2KxPKWmHPoXNUEdNZx0u3QvMMe4fjqOADh-6i8mZHZca3moPewmulvvvC0z-w4hAa-Hcsh9a3jio0vHR4NDYJJ84uuGkFxtirei-yR2Dw2tVg',
    'Authorization': 'bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.asset.zoneId,
    'Content-Type' : 'application/json;charset=utf-8'
  }
};

  // var options = {
  // url: config.asset.ingestUri+'/'+ req.params.type
  //     };

console.log("HERE: " + config.asset.ingestUri+'/'+ req.params.type);
  // console.log(JSON.stringify(options, null, 2));

  request.post(config.asset.ingestUri+'/'+ req.params.type,{ "uri": "/tags/sensor5a"}, function (error, response, body) {
    console.log("TRYING TO POIST" + error)
     if (!error && response.statusCode == 200) {

      //self.model = JSON.parse(response.body);
      //self.model  = JSON.stringify(self.modelA);
      console.log("[INFO] fetching token: " + response); 
    callback(200, JSON.parse(response.body));
    } else if (response === undefined || error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode + " " + error);
    }
  });
};


// AssetController.prototype.sendPayload = function(req, callback) {
//   console.log("[INFO] Fetching asset...");
//   var self = this;


//   var options = {
//   url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
//   //method: 'GET',
//   headers: {
//     'Authorization': 'bearer ' + uaaController.getToken(),
//     'Predix-Zone-Id': config.timeseries.zoneId,
//     'Content-Type' : 'application/json'
//   }
//       };

// console.log("HERE: time !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
//   // console.log(JSON.stringify(options, null, 2));

//   request.post(options, function (error, response, body) {
//     console.log("TRYING TO POIST" + error)
//      if (!error && response.statusCode == 200) {

//       //self.model = JSON.parse(response.body);
//       //self.model  = JSON.stringify(self.modelA);
//       console.log("[INFO] fetching token: " + response); 
//     callback(200, JSON.parse(response.body));
//     } else if (response === undefined || error || response.statusCode != 200) {
//       console.log("[INFO] Error fetching token: " + response.statusCode + " " + error);
//     }
//   });
// };


// AssetController.prototype.checkTS = function(req, callback) {
//   console.log("[INFO] Fetching TS...");
//   var self = this;

//  uaaController.fetchTokenKitsTS(function(){
//     self.setHeaders();
//   });

// //   var options = {
// //   url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
// //   headers: {
// //     'Authorization': 'bearer ' + uaaController.getToken(),
// //     'Predix-Zone-Id': 'ad85c18d-6ad0-463c-a4b2-175567ffa7ef',
// //     'Content-Type' : 'application/json'
// //   },
// //   body: {

// //   }
// // };

// var options = { method: 'POST',
//  url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
//  headers: 
//   { 
//     'cache-control': 'no-cache',
//     'predix-zone-id': 'ad85c18d-6ad0-463c-a4b2-175567ffa7ef',
//     'content-type': 'application/json',
//     authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJkMzQ4NGNiZC03YTBhLTQyYmUtYjMwYi03YzY3MWQwYWQ5Y2MiLCJzdWIiOiJwcmVkaXhfdHJhbnNmb3JtXzEiLCJzY29wZSI6WyJ0aW1lc2VyaWVzLnpvbmVzLmFkODVjMThkLTZhZDAtNDYzYy1hNGIyLTE3NTU2N2ZmYTdlZi5pbmdlc3QiLCJ1YWEucmVzb3VyY2UiLCJwcmVkaXgtYXNzZXQuem9uZXMuOGIzOTQ1ZDAtYjNkOS00ODdmLWFjZWMtYzZhNThlNWQ2YjUzLnVzZXIiLCJvcGVuaWQiLCJ1YWEubm9uZSIsInRpbWVzZXJpZXMuem9uZXMuYWQ4NWMxOGQtNmFkMC00NjNjLWE0YjItMTc1NTY3ZmZhN2VmLnF1ZXJ5IiwidGltZXNlcmllcy56b25lcy5hZDg1YzE4ZC02YWQwLTQ2M2MtYTRiMi0xNzU1NjdmZmE3ZWYudXNlciJdLCJjbGllbnRfaWQiOiJwcmVkaXhfdHJhbnNmb3JtXzEiLCJjaWQiOiJwcmVkaXhfdHJhbnNmb3JtXzEiLCJhenAiOiJwcmVkaXhfdHJhbnNmb3JtXzEiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjM5MzUxY2JlIiwiaWF0IjoxNDY5MDE5MzQ4LCJleHAiOjE0NjkwNjI1NDgsImlzcyI6Imh0dHBzOi8vOWJmNGE5YmEtNzliMS00MDU1LTgyODItMDk2ZDhkNDc4OTQxLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiOWJmNGE5YmEtNzliMS00MDU1LTgyODItMDk2ZDhkNDc4OTQxIiwiYXVkIjpbInByZWRpeF90cmFuc2Zvcm1fMSIsInRpbWVzZXJpZXMuem9uZXMuYWQ4NWMxOGQtNmFkMC00NjNjLWE0YjItMTc1NTY3ZmZhN2VmIiwidWFhIiwicHJlZGl4LWFzc2V0LnpvbmVzLjhiMzk0NWQwLWIzZDktNDg3Zi1hY2VjLWM2YTU4ZTVkNmI1MyIsIm9wZW5pZCJdfQ.mxu1lIGTXweuwwKC9taDfK9-Kmh8v0rCBmhXp9SngfRVdkFXbP7retJoDnt3InXpMdBUNyNoc8ZLk3Bfc1Dr9yCW9rQ_r4pTYCUKyoPgr7XkPvdLEvsbmf8dHXmzHDz7YzRlaDAE_tiGX_5EFdskXrXk80SxnrjYSpyGLsJMk9YKGwJURrPfx8bi-xfi1bR_0EAXI-S1N-SkuF4O3pf7ahPhk5YahJaADJadcO7ZCKUQFbZXWUsNbY4FBXbUaGHYHglKSXBZJA1TfrORfzeIGKwrbcxwtFNf72Gfq0TADiX0qASoyCvVOCJ1VzrcNqiLmmKqKNyrzdPBjQ8QcxdZkA' },
//  body: { start: '30s-ago', tags: [ { name: 'Grove' } ] },
//  json: true };

// console.log("HERE: TS");
//   // console.log(JSON.stringify(options, null, 2));

//   request(options, function (error, response, body) {
//     if(error) throw new Error(error);
//     console.log(body);
//   });
// };

AssetController.prototype.getModel = function() {
  return this.model;
};

module.exports = new AssetController();

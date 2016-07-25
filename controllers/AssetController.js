var WebSocket = require('ws');

var UAAController = require('../controllers/UAAController');
var uaaController = new UAAController();

//var PayloadValidator = require('../controllers/PayloadValidator');

var config = require('../config/config.js');

function AssetController() {
  this.headers = {};

  this.date = new Date();

  // Fetch a token and set headers
  var self = this;
  uaaController.fetchToken(function(){
    self.setHeaders();
  });
}

// AssetController.prototype.setHeaders = function(){
//   this.headers = {
//     //'Authorization': 'Bearer ' + uaaController.getToken(),
//     'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJjNzk0ODNmNS00MjA2LTQyYzQtYmI3Mi1iZWE5YmRjZWFmMmQiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY3OTAyNTU5LCJleHAiOjE0Njc5NDU3NTksImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.e-oRnAr3jrEojtCyPv-mI0cC4mQ-vtb92cQfDwe6Qd7vQtOdnQTQ269PShFYCaYw6q3Inoo3Madr_kZ_v0KdjpHXMvOLCr7aW6SxDlCFrBEARuExsz4Bk9OzDl96DJ4VByvK4JNiEbddYfkWPHb862OvmQf4bjYpi457LEivn4HxWm4x9-jjr9HWGVMPQpTBYQLujUuqs8NBK1o2r_etmS7Lo2PXhudLp7j0AvGIOp1S_7zAIJr5pe0xUvx_Ir1mOL13Dhi9NAe9xTv6ebety2H4NjVc3AQqm4fZQBD78GQbmC9T7Z8HJdkJs4LHatUkqEzSiHQjEbvPdm--pZTbKQ',
//     'Predix-Zone-Id': config.timeseries.zoneId,
//     'Content-Type': 'application/json'
//    // 'Origin': 'https://' + config.application_uri
//   };
// };

// AssetController.prototype.setHeaders = function(){
//   this.headers = {
//     //'Authorization': 'Bearer ' + uaaController.getToken(),
//     'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJjNzk0ODNmNS00MjA2LTQyYzQtYmI3Mi1iZWE5YmRjZWFmMmQiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY3OTAyNTU5LCJleHAiOjE0Njc5NDU3NTksImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.e-oRnAr3jrEojtCyPv-mI0cC4mQ-vtb92cQfDwe6Qd7vQtOdnQTQ269PShFYCaYw6q3Inoo3Madr_kZ_v0KdjpHXMvOLCr7aW6SxDlCFrBEARuExsz4Bk9OzDl96DJ4VByvK4JNiEbddYfkWPHb862OvmQf4bjYpi457LEivn4HxWm4x9-jjr9HWGVMPQpTBYQLujUuqs8NBK1o2r_etmS7Lo2PXhudLp7j0AvGIOp1S_7zAIJr5pe0xUvx_Ir1mOL13Dhi9NAe9xTv6ebety2H4NjVc3AQqm4fZQBD78GQbmC9T7Z8HJdkJs4LHatUkqEzSiHQjEbvPdm--pZTbKQ',
//     'Predix-Zone-Id': '10a21c94-1c44-44dc-86a3-9a1c7d50576e',
//     'Content-Type' : 'application/json'
//   };
// };

AssetController.prototype.setHeaders = function(){
  this.headers = {
    'Authorization': 'Bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.timeseries.zoneId,
    'Origin': 'https://' + config.application_uri
  };
};

AssetController.prototype.getAssets = function(type, callback) {
  request({
    uri: config.asset.ingestUri + '/' + type, //URL to hit
    method: 'GET',
    headers: {
        'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI4ZTk4MGFmOC01Yjg1LTRhMGYtOTQwNC01ZTIwNGMxYzIzMGIiLCJzdWIiOiJhcHAtY2xpZW50LWlkIiwic2NvcGUiOlsidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQuaW5nZXN0IiwidGltZXNlcmllcy56b25lcy5mYTZjODAwMC00Y2M4LTRmYTktYTMwNy0wNzVmYmZhYTg4OGQucXVlcnkiLCJ1YWEucmVzb3VyY2UiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZC51c2VyIiwib3BlbmlkIiwidWFhLm5vbmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuMTBhMjFjOTQtMWM0NC00NGRjLTg2YTMtOWExYzdkNTA1NzZlLnVzZXIiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4LnVzZXIiXSwiY2xpZW50X2lkIjoiYXBwLWNsaWVudC1pZCIsImNpZCI6ImFwcC1jbGllbnQtaWQiLCJhenAiOiJhcHAtY2xpZW50LWlkIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiIzYzA2Zjk2IiwiaWF0IjoxNDY3OTgxMjIwLCJleHAiOjE0NjgwMjQ0MjAsImlzcyI6Imh0dHBzOi8vNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNWYyZmI3ODEtZjE0Zi00ZjUwLTk4YWYtMDNlMzBmMzU1ZGNhIiwiYXVkIjpbImFwcC1jbGllbnQtaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmZhNmM4MDAwLTRjYzgtNGZhOS1hMzA3LTA3NWZiZmFhODg4ZCIsInVhYSIsIm9wZW5pZCIsInByZWRpeC1hc3NldC56b25lcy4xMGEyMWM5NC0xYzQ0LTQ0ZGMtODZhMy05YTFjN2Q1MDU3NmUiLCJwcmVkaXgtYXNzZXQuem9uZXMuNDVmN2U2NDUtOTFkNS00ZjRiLTg2YTAtOTgzZjlmNjdiYWU4Il19.hBCJvs38h0eBtpu5e9wWOL1f4nZn73knwt-YpaXGMGNfCla8Phu6YJ-d_g0oYTW-fFMwDhi-BVkVhKyEcclbzIi1AU-sqlnu9lBfLQDK5lCgjubZ15cqU2rKpIGGm8aeN3Xk4lRpw_167e6v4DTsoYIZ8K81FdSuPPA3_36PLXKZrcb6BCv9pxlzS4_KeFFt0UL6uWakxUq_qez5kHwgddkzXyzwDZe2pP2PgMsGR55oCxu8oiZKDfT5ZLNFNavmruYC3fr8Tm9O4PEG1ecel9SIt4DUA4SHvfmw1HHZNLTtony2_-BBPmOHNJPUk3fP9x2M-D6NWRa6zbkfNkCqVA',
        'Predix-Zone-Id': config.asset.zoneId,
        'Content-Type' : 'application/json'
    },
    //body: JSON.stringify(body)
  }, function(error, response){
    if(error) {
        console.log(error);
        callback('500', error);
    } else {
        console.log(response.statusCode);
        callback(response.statusCode);
    }
  });
};

AssetController.prototype.sendPayload = function(body, callback) {
  var self = this;
  // Format payload with messageId as current time
  var payload = {"messageId": this.date.getTime(), "body": body};

  // If payload is not valid, respond with 422 error and error object and return
  // else, continue
  // if (PayloadValidator.validate(payload) === false){
  //   console.log("[INFO] Invalid payload.");
  //   callback(422, JSON.stringify({error: PayloadValidator.getErrors(payload)}));
  //   return;
  // }


  var socket = new WebSocket(config.timeseries.ingestUri, { headers: this.headers });
console.log("[INFO!!!!!!] WebSocket connection opened ?????. " + config.timeseries.ingestUri+ " : : " + this.headers.Authorization + " : : " );
  socket.on('open', function open() {
    console.log("[INFO] WebSocket connection opened.");
    console.log("[INFO] sending payload with messageId: " + payload.messageId + "...");
    console.log(JSON.stringify(payload, null, 2));
    socket.send(JSON.stringify(payload), function ack(error) {
      if (error) {
        console.log("[INFO] Error sending payload " + payload.messageId);
        callback(500, JSON.stringify({error: error + ' error here'}));
      } else {
        console.log("[INFO] payload " + payload.messageId + " successfully sent.");
      }
    });
  });

  socket.on('message', function(data, flags) {
    //callback(200, JSON.stringify(JSON.parse(data), null, 2));
    callback(200, JSON.stringify({postStatus: "post was successful -- change!"}));
    socket.close();
    console.log("[INFO] WebSocket connection closed.");
  });

  socket.on('error', function(error) {
    // If 401 Unauthorized, refresh token and try again
    // var errorCodeRegEx = /\d{3}/;
    // if (error.toString().match(errorCodeRegEx)[0] == '401') {
    //   console.log("[INFO] Token has expired - refreshing token and re-attempting send...");
    //   uaaController.fetchToken(function(){
    //     self.setHeaders();
    //     self.sendPayload(body, function(status, message){
    //       callback(status, message + ' eeeerrrooorrr');
    //     });
    //   });
    // } else {
      console.log("[INFO] " + error.toString());
      callback(500, JSON.stringify({error: error + ' 500 here' }));
   // }
  });
};

module.exports = new AssetController();

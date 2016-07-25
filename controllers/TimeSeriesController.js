var WebSocket = require('ws');

var UAAController = require('../controllers/UAAController');
var uaaController = new UAAController();

var PayloadValidator = require('../controllers/PayloadValidator');

var config = require('../config/config.js');

function TimeSeriesController() {
  this.headers = {};

  this.date = new Date();

  // Fetch a token and set headers
  var self = this;
  uaaController.fetchToken(function(){
    self.setHeaders();
  });
}

TimeSeriesController.prototype.setHeaders = function(){
  this.headers = {
    'Authorization': 'Bearer ' + uaaController.getToken(),
    'Predix-Zone-Id': config.timeseries.zoneId,
    'Origin': 'https://' + config.application_uri
  };
};

TimeSeriesController.prototype.sendPayload = function(body, callback) {
  var self = this;
  // Format payload with messageId as current time
  var payload = {"messageId": this.date.getTime(), "body": body};

  // If payload is not valid, respond with 422 error and error object and return
  // else, continue
  if (PayloadValidator.validate(payload) === false){
    console.log("[INFO] Invalid payload.");
    callback(422, JSON.stringify({error: PayloadValidator.getErrors(payload)}));
    return;
  }

  var socket = new WebSocket(config.timeseries.ingestUri, { headers: this.headers });

  socket.on('open', function open() {
    console.log("[INFO] WebSocket connection opened.");
    console.log("[INFO] sending payload with messageId: " + payload.messageId + "...");
    console.log(JSON.stringify(payload, null, 2));
    socket.send(JSON.stringify(payload), function ack(error) {
      if (error) {
        console.log("[INFO] Error sending payload " + payload.messageId);
        callback(500, JSON.stringify({error: error}));
      } else {
        console.log("[INFO] payload " + payload.messageId + " successfully sent.");
      }
    });
  });

  socket.on('message', function(data, flags) {
    callback(200, JSON.stringify(JSON.parse(data), null, 2));
    socket.close();
    console.log("[INFO] WebSocket connection closed.");
  });

  socket.on('error', function(error) {
    // If 401 Unauthorized, refresh token and try again
    var errorCodeRegEx = /\d{3}/;
    if (error.toString().match(errorCodeRegEx)[0] == '401') {
      console.log("[INFO] Token has expired - refreshing token and re-attempting send...");
      uaaController.fetchToken(function(){
        self.setHeaders();
        self.sendPayload(body, function(status, message){
          callback(status, message);
        });
      });
    } else {
      console.log("[INFO] " + error.toString());
      callback(500, JSON.stringify({error: error}));
    }
  });
};

module.exports = new TimeSeriesController();

var request = require('request');
var config = require('../config/config.js');


function UAAController() {
  this.uaaTokenRequestUrl = config.uaa.issuerId + '?grant_type=client_credentials';
  this.access_token = null;
   this.access_tokenTS = null;
}

UAAController.prototype.fetchToken = function(callback) {
  console.log("[INFO] Fetching token...");
  var self = this;

  var options = {
    url: this.uaaTokenRequestUrl,
    headers: {'Authorization': 'Basic YXBwLWNsaWVudC1pZDpzZWNyZXQ=' }
    //headers: {'Authorization': 'Basic ' + config.asset.client_credential }
  };

  // console.log(JSON.stringify(options, null, 2));

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      self.access_token = JSON.parse(body).access_token;
      console.log("[INFO] Token fetched (expires in " + JSON.parse(body).expires_in + " seconds).");
      callback();
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
      callback();
    }
  });
};

UAAController.prototype.fetchTokenTS = function(callback) {
  console.log("[INFO] Fetching token...");
  var self = this;

  var options = {
    url: 'https://9bf4a9ba-79b1-4055-8282-096d8d478941.predix-uaa.run.aws-usw02-pr.ice.predix.io',
    headers: {'Authorization': 'Basic cHJlZGl4X3RyYW5zZm9ybV8xOnByM2RpeEtpdHNSMGNr' }
    //headers: {'Authorization': 'Basic ' + config.asset.client_credential }
  };

  // console.log(JSON.stringify(options, null, 2));

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      self.access_tokenTS = JSON.parse(body).access_tokenTS;
      console.log("[INFO] Token fetched (expires in " + JSON.parse(body).expires_in + " seconds).");
      callback();
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching token: " + response.statusCode);
      callback();
    }
  });
};


UAAController.prototype.getToken = function() {
  return this.access_token;
};

UAAController.prototype.getTokenTS = function() {
  return this.access_tokenTS;
};

module.exports = UAAController;

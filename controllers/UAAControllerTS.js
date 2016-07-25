var request = require('request');
var config = require('../config/config.js');


function UAAControllerTS() {
  this.uaaTokenRequestUrl = config.uaa.issuerId + '?grant_type=client_credentials';
  this.access_token = null;
   this.access_tokenTS = null;
}

UAAControllerTS.prototype.fetchToken = function(callback) {
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

UAAControllerTS.prototype.fetchTokenTS = function() {
  console.log("[INFO] Fetching token...");
  var self = this;

  var options = { method: 'POST',
  url: 'https://9bf4a9ba-79b1-4055-8282-096d8d478941.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
  headers: 
   { 
     'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded',
     authorization: 'Basic cHJlZGl4X3RyYW5zZm9ybV8xOnByM2RpeEtpdHNSMGNr' },
  form: 
   { grant_type: 'client_credentials',
     client_id: 'predix_transform_1' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(JSON.parse(body).access_token);
  self.access_tokenTS = JSON.parse(body).access_token;
  return self.access_tokenTS;
});

};


UAAControllerTS.prototype.getToken = function() {
  return this.access_token;
};

UAAControllerTS.prototype.getTokenTS = function() {
  return this.access_tokenTS;
};

module.exports = UAAControllerTS;

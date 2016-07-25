var Validator = require('jsonschema').Validator;

function PayloadValidator(payload){
  this.v = new Validator();

  this.payloadSchema = {
    "id": "/payload",
    "type": "object",
    "maxProperties": 2,
    "properties": {
      "messageId": {
        "required": true
      },
      "body": {
        "type": "array",
        "minItems": 1,
        "required": true,
        "items": {
          "type": "object",
          "minProperties": 2,
          "maxProperties": 3,
          "properties": {
            "name": {
              "type": "string",
              "required": true
            },
            "datapoints": {
              "type": "array",
              "required": true,
              "minItems": 1,
              "items": {
                "type": "array",
                "maxItems": 3,
                "items": [
                  {"id": "0", "type": "integer", "required": true, "format": "utc-millisec"},
                  {"id": "1", "type": "number", "required": true},
                  {"id": "2", "type": "integer", "required": false, "minimum": 0, "maximum": 3},
                ]
              }
            },
            "attributes": {
              "type": "object",
              "required": false
            }
          }
        }
      }
    },
  };
}

// Returns true (valid) if there are no errors in validation
PayloadValidator.prototype.validate = function(payload) {
  result = this.v.validate(payload, this.payloadSchema);
  if (result.errors.length > 0) {
    console.log(result.errors);
    return false;
  } else {
    return true;
  }
};

// Returns error object
PayloadValidator.prototype.getErrors = function(payload) {
  result = this.v.validate(payload, this.payloadSchema);
  return result.errors;
};

module.exports = new PayloadValidator();

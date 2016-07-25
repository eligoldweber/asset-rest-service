timeseries-rest-service
=======================

A simple RESTful endpoint for data ingestion into Predix Time Series.

DO NOT USE FOR HIGH VOLUMES OF DATA!  
That's why ingestion uses WebSockets in the first place.  

This is meant to be an easier way for getting periodic data dumps into Time Series.

For example, if you wanted to deposit readings every 5 minutes from an MES system, this might be a good solution.

## Usage

In `manifest.yml`, you must enter your exact service names for UAA and Timeseries under `services:`, as well as providing environment variables `client` with the value of a UAA client name with permission to ingest into timeseries and `client_credential` with the value of base64 encoded client:secret.

Then, push to the app to the cloud with `cf push`

Note: local usage is not currently supported

## API Documentation

* **URL**

    /

* **Method:**

  `POST`

* **Data Params**

  Headers
    ```  
    Content-Type: application/json
    Authorization: <base64 encoded client:secret>
    ```

  Body
    ``` json
    [
     {
        "name":"<tagName>",
        "datapoints":[
          [
            <Timestamp>,
            <Measure>,
            <Quality>
          ]
        ],
        "attributes":{
           "AttributeKey1": "AttributeValue1",
           "AttributeKey2": "AttributeValue2",
        }
      }
    ]
    ```
* **Success Response:**

  * **Code:** 200 OK  
    **Content:**  
      ```
      {
        "messageId": <MessageID>,
        "statusCode": <AcknowledgementStatusCode>
      }
      ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST  
    **Content:**  

  * **Code:** 401 UNAUTHORIZED  
    **Content:** `{ error : "Unauthorized" }`

  * **Code:** 422 UNPROCESSABLE ENTRY  
    **Content:** `{ error : [Error Object] }`

  * **Code:** 500 INTERNAL SERVER ERROR  
    **Content:** `{ error : [Error Object] }`  

* **Sample Call:**

  ```
  curl -X POST -H "Content-Type: application/json" -H "Authorization: cG9jX3RpbWVzZXJpZXNfY2xpZW50OnN1cGVyc2VjcmV0" -H "Cache-Control: no-cache" -d '[
    {
      "name":"4fd128d3-f55c-45fb-a369-7e0d2db2034e.WIPReady",
      "datapoints":[
        [
          1458669981196,
          35,
          3
        ]
      ],
      "attributes":{
        "UoM": "EA"
      }
    }
  ]' "https://timeseries-rest-service.run.asv-pr.ice.predix.io/"
  ```

* **Notes:**

  `<tagName>` - (Required) Name of the tag  
  `<Timestamp>` - (Required) unix timestamp (time since epoch) in milliseconds  
  `<Measure>` - (Required) Numeric value  
  `<Quality>` - (Required) Quality of the data [0, 1, 2, 3]  
        0 - Bad quality  
        1 - Uncertain quality  
        2 - Not applicable  
        3 - Good quality (Default)  
  `<Attributes>` - (Optional) Any data associated with a tag.  
    ex. "uri": "/assets/1"


## Author
Alexander Wong
# asset-rest-service

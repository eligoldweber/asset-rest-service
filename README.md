asset-rest-service
=======================

This is a nodejs micro service that can be hosted in Predix or other cloud foundry systems.

There are 2 routes that are supported in this microservice.

	GET -- /:type/:model 

This route is for testing purposes, since it will return a specific asset from the asset registry.

The second one is:
	
	POST -- /demo/:type/:model

This contains the main functionality of the microservice. 
A typical body for this POST would include:

	{	
		"kits" : "/kits/....",
		"devices" : "/devices/deviceID"
	}

This route does quite a lot:

First the microservice queries the intermidiate asset registry to gain all more information about the sensor that was added to the edge device.
Once it gets the response from this asset registry, it creates a temporary asset of the sensor with the updated info.  

A unique UUID is created and used as the tag for uri for the asset. To ensure that the UUID is unique a POST to a global TimeSeries Instance is made for that unique uri.  If there are no tags in timeseries associated with that uri, it is considered unique. 

Assuming that the Uri is considerd Unique, then the microservice returns the updated asset as for the initial POST call.

At the same time, the microservice posts the updated asset to a Global Asset Instance so that a global view can be kept.


[Note: If called from https://github.com/mwilli31/predix-asset-local the local edge device will use the response of the updated asset to update the temporary asset that was being stored in the local asset DB]

-----------------------------------------------------------
HOW TO CONFIGURE THE ASSET-REST-SERVICE FOR A DIFFERENT UAA
----------------------------------------------------------- 

Pushing the app to a new UAA:
Make sure that when psuhing this app to a new UAA that the names are modified in the manifest file, and when pusing, use either a custom route or a random route so to avoid conflict. 

["https://asset-rest-service.run.aws-usw02-pr.ice.predix.io"] is taken already as the default

-----------------------------------------------------------
There are a number of changes that are needed inorder for this microservice to run correctly in a different environment outlined below are the necessary steps.

First you need to define the locations and UAA instances for three things.
	1) location of Asset Registry (This uses the /sensors/... uri)
	2) location for Global Asset Registry (where all the created tags are sent) 
	3) location for Global TimeSeries (Typically the same UAA as the Global Asset)
Note: all three could be from the same UAA or 1 can be different than 2 and 3.

Pretty much all the changes that you need to now are in the /controllers/AssetCrontroller.js file

If the UAA that you push this microservice is the same as you are using for any of the above UAA instances then there are less changes to make, since the config file will gather the necessary items for you.

The important method for this microservice is the processAsset:

[You will notice that inside this method, that a few methods are being called. Two of them are "getUAA" and "getUAAGlobal". these need to be modified too.]

modifications that need to be made:
(CHANGES IN "processAsset")

1) Change the headers for the initial GET

			headers: {
		    'Authorization': 'bearer ' + localUAA,
		    'Predix-Zone-Id': config.asset.zoneId,
		    'Content-Type' : 'application/json'
		     }

the local UAA is retreived from the "getUAA" funtion and is the bearer token for the AssetRegistry(1).
Predix-Zone-Id is the asset zone id for the AssetRegistry - if the app is deployed in the same UAA as the asset registry then leave the config as is. if it is not, change the this field to reflect the correct Zone-Id.

2) Inside the initial GET from the AssetRegistry, change where the new uri is being set

			self.model[0].uri = "/testEli/"+self.model[0].uri.substr(self.model[0].uri.indexOf('G')) + "-uuid-" + uuid1; 

The first part of the URI needs to be the correct URI of where you would want to store the global instance, normally use "/tags/"
This piece needs to match the end of the url in the "postGlobalAsset" function.

3) Right after calling "getUAAGlobal" the method "checkTS" is called

			self.checkTS(self.model[0].uri,UaaGlobal,function(temp){ //check uri vs global timeseries

Note the second parameter "UaaGlobal" that is the UAA returned from the "getUAAGlobal" function, make sure that this method is configured properly to return the UAA that is associated with the GlobalTS

4) Similar to step (3) check:

			self.postGlobalAsset(self.model,localUAA,function(temp){ //post to global asset

Likewise look at the second parameter. Right now it is set to post to the localUAA (the uaa where the app is pushed to) this is for testing purposes, but should be the UaaGlobal

(CHANGES IN "checkTS")


5) Inside this method make sure that the TS Predix-Zone-Id is correct for where the globalTS is stored. [note: if this is the same as the ts in the same UAA  as the app, then modify the config file and use "config.timeseries.zoneId"]


(CHANGES IN "postGlobalAsset")

6) Change the end of the URL to reflect where in the asset model that the updated model will be posted (mainly /tags/)

7) Make sure that the Zone-Id is correct and consitant with the UAA that is being passed in


(CHANGES IN "getUAA" and "getUAAGlobal")
	
8) modify the url and the authorization fields to reflect the correct values




Also make sure to make appropriate changes in the manifest file, escpecially to make use of the config file.



This is also in "configMicroservice.txt"	

-----------------------------------------

the files that are relevant are:

manifest.yml

/routes/index.js **

/controllers/AssetController.js **

/controllers/UAAController.js

/config/config.js
  
/bin/www

app.js


-----------------------------------------
Eli Goldweber

Thanks to Alexander Wong for getting me started

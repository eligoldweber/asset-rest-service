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

-----------------------------------------
To change the Authentication to work for other UAA instances, modify the /controllers/AssetController.js file. There are 2 functions that take care of the UAA authentication.

For Local UAA (Asset Registry) modify:

	AssetController.prototype.getUAA = function(callback)

For GLobal UAA (Global Timeseries and Global Asset) modify:

	AssetController.prototype.getUAAGlobal = function(callback)

These functions need the UAA endpoint authorization URL, and the BASIC authentication \

Also in the manifest file make sure to include the local UAA instance
and for the GLOBAL ASSET methods make sure to include the Zone-ID

	AssetController.prototype.postGlobalAsset = function(req,uaa, callback) 

-----------------------------------------

the files that are relevant are:

  manifest.yml

  app.js

  /routes/index.js

  /controllers/AssetController.js

  /config/config.js
  
  /bin/www

-----------------------------------------
Eli Goldweber

Thanks to Alexander Wong for getting me started

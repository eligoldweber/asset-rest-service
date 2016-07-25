var config = {};

if (process.env.NODE_ENV === 'production'){ // i.e. in Cloud Foundry
  // Obtains relevant information from the app's Cloud Foundry environment variables
  VCAP_APPLICATION = JSON.parse(process.env.VCAP_APPLICATION);
  VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);

  config.application_uri = VCAP_APPLICATION.application_uris[0];

  // config.timeseries = {};
  // config.timeseries.client_credential = process.env.client_credential;
  // config.timeseries.zoneId = VCAP_SERVICES[process.env.timeseries_service_label][0]["credentials"]["ingest"]["zone-http-header-value"];
  // config.timeseries.ingestUri= VCAP_SERVICES[process.env.timeseries_service_label][0]["credentials"]["ingest"]["uri"];

  config.asset = {};
  config.asset.client_credential = process.env.client_credential;
  config.asset.zoneId = VCAP_SERVICES[process.env.asset_service_label][0]["credentials"]["zone"]["http-header-value"];
  config.asset.ingestUri= VCAP_SERVICES[process.env.asset_service_label][0]["credentials"]["uri"];

  config.uaa = {};
  config.uaa.issuerId = VCAP_SERVICES[process.env.uaa_service_label][0]["credentials"]["issuerId"];
} else { // development, not in cloud
  // Enter your information manually (use `cf env` on the app after you've pushed once)
  config.application_uri = "";

  config.timeseries = {};
  config.timeseries.client_credential = "";
  config.timeseries.zoneId = "";
  config.timeseries.ingestUri= "";

  config.uaa = {};
  config.uaa.issuerId = "";
}

module.exports = config;

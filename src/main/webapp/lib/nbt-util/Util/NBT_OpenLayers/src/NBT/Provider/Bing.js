/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Bing maps and geocoding.
 *
 * @requires NBT/Provider.js
 */
NBT.Provider.Bing = OpenLayers.Class(NBT.Provider, {

    /**
     * apiKey - String, required for the layers or geocoding to work.
     */
    apiKey: null,

    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Build the general Bing basemap layers. Parameters will end up setting the
     * map's number of zoom levels, how far you can zoom in or out. maxRes must
     * be exact resolution from the Bing Layers (see {OpenLayers.Layer.Bing},
     * 19567.87923828125 for example) or the layer images won't load properly.
     */
    getLayers: function(zoomLevels, minZoom, maxRes)
    {
      var zl = (typeof(zoomLevels) != 'undefined') ? zoomLevels : 11;
      var minZ = (typeof(minZoom) != 'undefined') ? minZoom : 3;
      var maxR = (typeof(maxRes) != 'undefined') ? maxRes : 19567.87923828125;

      // TODO: This doesn't do it all.
      var loadMetadataFix = function() {
        this._callbackId = "_callback_" + this.id.replace(/\./g, "_");
        // link the processMetadata method to the global scope and bind it
        // to this instance
        window[this._callbackId] = OpenLayers.Function.bind(
            // Use our slightly-modified version from below:
            NBT.Provider.Bing.processMetadata, this
        );
        var params = OpenLayers.Util.applyDefaults({
            key: this.key,
            jsonp: this._callbackId,
            include: "ImageryProviders"
        }, this.metadataParams);

        // http(s) detection changed here:
        var url = document.location.protocol + "//dev.virtualearth.net/REST/v1/Imagery/Metadata/" +
            this.type + "?" + OpenLayers.Util.getParameterString(params);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = this._callbackId;
        document.getElementsByTagName("head")[0].appendChild(script);
      };

      var bingRoads = new OpenLayers.Layer.Bing({
          name: "Streets",
          key: this.apiKey,
          type: "Road",
          minZoomLevel: minZ,
          numZoomLevels: zl,
          maxResolution: maxR,
          loadMetadata: loadMetadataFix
      });
      var bingHybrid = new OpenLayers.Layer.Bing({
          name: "Hybrid",
          key: this.apiKey,
          type: "AerialWithLabels",
          minZoomLevel: minZ,
          numZoomLevels: zl,
          maxResolution: maxR,
          loadMetadata: loadMetadataFix
      });
      var bingAerial = new OpenLayers.Layer.Bing({
          name: "Satellite",
          key: this.apiKey,
          type: "Aerial",
          minZoomLevel: minZ,
          numZoomLevels: zl,
          maxResolution: maxR,
          loadMetadata: loadMetadataFix
      });

      return [bingRoads, bingHybrid, bingAerial];
    },

    /**
     * Geocode a free-form address with Bing's geocoder.
     *
     * address: String, the address you need to locate.
     * handler: Function, a function that accepts the data object returned from Bing.
     TODO: What to do with a failure. Idea: have handlers included as a hash
     like success: function1, multiple: function2, fail: function3...
     * - options: hash including the following possibilities:
     *   - success: {function} return data on successful call.
     *   - fail: {function} return callback on failure.
     *   - toponly: {boolean} return only the best result to the success function.
     */
    geocode: function(address, options) {

      if (typeof(options.fail) == 'undefined')
      {
        options.fail = function() {}; // just eat it if it's undefined.
      }

      var baseUrl = OpenLayers.ProxyHost + 'http://dev.virtualearth.net/REST/v1/Locations?';
      var params = {
        key: options.apiKey || this.apiKey, //static use or instance
        q: address
      };

      var burl = baseUrl + encodeURIComponent(OpenLayers.Util.getParameterString(params));
      $.ajax({
        url: burl,
        async: false,
        dataType: 'json',
        success: function(data) {
          if (typeof(data.resourceSets[0].resources) != 'undefined')
          {
            var returnObject = (options.toponly) ? data.resourceSets[0].resources[0] : data;
            options.success(returnObject);
          }
          else
          {
            options.fail(data);
          }
        }
      });
    },

    CLASS_NAME: 'NBT.Provider.Bing'
});

/**
 * Crazy replacement of OL's processMetadata function needed in order to force
 * replacement of all http with https when run under ssl.
 * This is pretty brittle overall, but should be okay until Bing/OL change the
 * underlying stuff...
 */
NBT.Provider.Bing.processMetadata = function(metadata) {
  if (document.location.protocol == 'https:')
  {
    metadata.brandLogoUri = metadata.brandLogoUri.replace('http:', 'https:');
    metadata.resourceSets[0].resources[0].imageUrl = metadata.resourceSets[0].resources[0].imageUrl.replace('http:', 'https:');
  }

  this.metadata = metadata;
  this.initLayer();
  var script = document.getElementById(this._callbackId);
  script.parentNode.removeChild(script);
  window[this._callbackId] = undefined; // cannot delete from window in IE
  delete this._callbackId;
};


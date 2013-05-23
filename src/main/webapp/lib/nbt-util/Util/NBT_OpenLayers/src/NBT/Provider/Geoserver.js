/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Geoserver stuff.
 *
 * @requires NBT/Provider.js
 */
NBT.Provider.Geoserver = OpenLayers.Class(NBT.Provider, {

    /**
     * 'Root' url for layers.
     */
    baseUrl: null,

    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Retrieve an OL WFS Vector Layer object given a hash of config settings.
     * Required configs include:
     * - url:
     * - typeName:
     * - title:
     * - projection: {OpenLayers.Projection} object.
     * Optional configs include:

     */
    getWfsLayer: function(config) {

      var v = (typeof(config.version) != 'undefined') ? config.version : '1.1.0';
      var requestType = (typeof(config.requestType) != 'undefined') ? config.requestType : 'POST';
      var strats = (typeof(config.strategies) != 'undefined') ? config.strategies : null;
      var getAttributes = (typeof(config.retrieveAttributes) != 'undefined') ? config.retrieveAttributes : true;
      var ns = (typeof(config.featureNS) != 'undefined') ? config.featureNS : config.url;
      var geomName = (typeof(config.geomName) != 'undefined') ? config.geomName : 'the_geom';
      var showOnStart = (typeof(config.showOnStart) != 'undefined') ? config.showOnStart : true;

      // handle relative urls:
      if (config.url.indexOf('http') != 0)
      {
        config.url = this.baseUrl + config.url;
      }

      if (strats == null)
      {
        strats = [new OpenLayers.Strategy.BBOX()];
      }

      var wfsLayer = new OpenLayers.Layer.Vector(config.title, {
        strategies: strats,
        extractAttributes: getAttributes,
        styleMap: config.style,
        projection: config.projection,
        visibility: showOnStart
      });

      if (requestType.toUpperCase() == 'POST')
      {
        wfsLayer.protocol = new OpenLayers.Protocol.WFS({
            url: config.url,
            version: v,
            featureType: config.typeName,
            geometryName: geomName,
            featureNS: ns,
            srsName: config.projection.projCode,
            //featurePrefix: prefix,
            format: new OpenLayers.Format.WFST.v1_1_0({
                geometryName: geomName,
                featureType: config.typeName
            })
        });
      } else
      {
        wfsLayer.protocol = new OpenLayers.Protocol.HTTP({
            url: config.url,
            params: {
               format: "WFS",
               service: "WFS",
               request: "GetFeature",
               srs: config.projection.projCode,
               version: v,
               typename: config.typeName
            },
            format: new OpenLayers.Format.GML()
        });
      }

      if (config.filter != null && config.filter instanceof OpenLayers.Filter)
      {
        wfsLayer.filter = config.filter;
      }
      wfsLayer.isLoading = true; // initial... it will load eventually...

      // hint that can be read from other places:
      wfsLayer.events.register('loadstart', wfsLayer, function() {
          wfsLayer.isLoading = true;
      });
      wfsLayer.events.register('loadend', wfsLayer, function() {
          wfsLayer.isLoading = false;
      });

      return wfsLayer;
    }
});

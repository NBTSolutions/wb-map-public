/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * ArcGIS connectivity, including REST and WFS.
 *
 * @requires NBT/Provider.js
 */
NBT.Provider.ArcGIS = OpenLayers.Class(NBT.Provider, {

    SPHERICAL_MERCATOR: new OpenLayers.Projection("EPSG:3857"),

    /**
     * 'Root' url for layers. A single service should have all layers nested in
     * a REST-style interface using URL patterns where the layer name is hiding
     * in there somewhere. So, use #service# in place in the URL and it will be
     * replaced in getLayer() with the 'service' parameter.
     */
    baseRestUrl: null,

    /**
     * ArcGIS appears to use different endpoints to serve REST and WFS calls, so
     * a separate base url is needed in cases where we're using both types.
     */
    baseWfsUrl: null,

    /**
     * Map object, pulled on init.
     */
    map: null,

    /**
     * Default configuration values.
     * - featureIdField: Field name containing unique ids. OBJECTID by default.
     */
    defaultLayerOptions: {
      title: null,
      featureIdField: 'OBJECTID',
      nameField: null,
      visibility: true,
      displayInLayerSwitcher: true,
      displayOutsideMaxExtent: true, // required because maxExtent is 4326.
      isBaseLayer: false,
      projection: OpenLayers.Projection.SphericalMercator,
      requestType: 'POST',
      getAttributes: true,
      typeName: null,
      filter: null,
      version: '1.1.0',
      restOptions: {} // options specific to REST service, like layer id, image format, and srs.
    },

    defaultWfsConfig: {
    },

    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Retrieve an OL REST {Layer} sending back tiled imagery. Required config
     * options include:
     * - service: Name of the REST service, to be mixed in the base url.
     * - title: Name to use in display and find operations.
     *
     */
    getRestLayer: function(options) {

      OpenLayers.Util.applyDefaults(options, this.defaultLayerOptions);

      // update default layer options with passed in values:
      var config = OpenLayers.Util.extend({
          layers: '0',
          format: 'png',
          transparent: true
      }, options.restOptions);

      var layer = new OpenLayers.Layer.ArcGIS93Rest(options.title,
        this.baseRestUrl.replace('#service#', options.service) + '/export', config, options);

      // consider older options:
      // var strats = (typeof(config.strategies) != 'undefined') ? config.strategies : null;
      // var getAttributes = (typeof(config.retrieveAttributes) != 'undefined') ? config.retrieveAttributes : true;
      // var ns = (typeof(config.featureNS) != 'undefined') ? config.featureNS : config.url;
      // var geomName = (typeof(config.geomName) != 'undefined') ? config.geomName : 'the_geom';
      // var showOnStart = (typeof(config.showOnStart) != 'undefined') ? config.showOnStart : true;

      layer.isLoading = true; // initial... it will load eventually...

      // hint that can be read from other places:
      layer.events.register('loadstart', layer, function() {
          this.isLoading = true;
      });
      layer.events.register('loadend', layer, function() {
          this.isLoading = false;
      });

      return layer;
    },

    getCacheLayer: function(options)
    {
      var fullUrl = OpenLayers.ProxyHost + this.baseRestUrl.replace('#service#', options.service);
      // TODO: append ?f=json on the end here.
      var layer = null;
      // retrieve the layer configuration from ArcGIS directly:
      $.ajax({
          url: fullUrl,
          async: false,
          dataType: 'json',
          success: function(data) {
            layer = new OpenLayers.Layer.ArcGISCache(options.title, fullUrl, {
                layerInfo: data
            });
          }
      });

      return layer;
    },

    /**
     * build a single WFS Layer. Config options must include:
     *
     * url: URL to reach the WFS
     * typeName: The wfs type name
     * title: Title for layer switcher, etc.
     *
     * Optional config params:
     * namespace: Namespace URL, will use url if not set.
     * projection: OpenLayers.Projection object.
     * style: OpenLayers.StyleMap
     * displayStrategies: Clustering, etc.
     * filter: OpenLayers.Filter
     * displayInSwitcher: boolean
     * getAttributes: boolean
     * visbility: boolean

     Add maxFeatureS?
     */
    getWfsLayer: function(config)
    {
      OpenLayers.Util.applyDefaults(config, this.defaultLayerConfig);

      // add in baseWfsUrl if a relative url has been passed in.
      config.url = (config.url.indexOf('http') == -1) ? this.baseWfsUrl + config.url : config.url;
      config.namespace = config.namespace || config.url;
      config.requestType = config.requestType || 'POST';
      config.projection = config.projection || this.SPHERICAL_MERCATOR;

      var layer = new OpenLayers.Layer.Vector(config.title, {
          strategies: config.displayStrategies,
          extractAttributes: config.getAttributes,
          styleMap: config.style,
          projection: config.projection,
          visibility: config.visibility
      });

      if (config.requestType.toUpperCase() == 'POST')
      {
        layer.protocol = new OpenLayers.Protocol.WFS({
            url: config.url,
            version: config.version,
            featureType: config.typeName,
            geometryName: 'Shape', // needed for ArcGIS
            featureNS: config.namespace,
            srsName: config.projection.projCode,
            format: new OpenLayers.Format.WFST.v1_1_0({
                geometryName: 'Shape', // needed for ArcGIS in BOTH places.
                featureType: config.typeName
            })
        });
      } else
      {
        layer.protocol = new OpenLayers.Protocol.HTTP({
            url: config.url,
            params: {
               format: "WFS",
               service: "WFS",
               request: "GetFeature",
               srs: config.projection.projCode,
               VERSION: config.version,
               typename: config.typeName
            },
            format: new OpenLayers.Format.GML()
        });
      }

      if (config.filter)
      {
        layer.filter = config.filter;
      }
      layer.isLoading = false;
      // WFS layers load in the background, so I'm using isLoading and the events
      // to detect when it's complete.
      layer.events.register('loadstart', layer, function() {
          this.isLoading = true;
      });
      layer.events.register('loadend', layer, function() {
          this.isLoading = false;
      });

      layer.refresh();
      return layer;
    },

    /**
     * Used for REST services at this point.
     */
    getFeatureControl: function(map, options)
    {
      var mr = new NBT.Protocol.MultiRequester({
          map: map,
          processUrl: options.processUrl,
          params: {
            f: 'json',
            tolerance: 20
          },
          format: new NBT.Format.ArcGIS(),
          filterToParams: function(filter, params) {
            // GetFeature creates a Spatial Filter on a click, and uses a
            // call to this function to turn it into parameters for the request,
            // so I can use it to do it to get all the parts ArcGIS expects.

            params.mapExtent = map.getExtent().toString();
            var size = map.getSize();
            params.imageDisplay = size.w + ',' + size.h + ',96'; // assume 96 dpi
            params.geometryType = 'esriGeometryEnvelope';
            if (filter.CLASS_NAME == 'OpenLayers.Filter.Spatial' && filter.type == 'BBOX' )
            {
              params.geometry = filter.value.toString();
            }

            return params;
          }
      });
      var formatter = new NBT.Format.ArcGIS();
      for(var s in options.services)
      {
        mr.addUrl(s, this.baseRestUrl.replace('#service#', options.services[s]) + '/identify', formatter.read);
      }

      var fc = new OpenLayers.Control.GetFeature({
          protocol: mr,
          single: false, // whether to allow more than 1 feature to be selected.
          box: false,
          hover: false,
          clickTolerance: 10
      });
      // This is ugly and definitely means a new class is needed:
      fc.protocol.map = map;

      fc.events.register('featureunselected', this, function(e) {
          $('div.olPopupCloseBox').click(); // close box.
      });
      fc.events.register("featuresselected", this, function(e) {
          console.log('fs');
          if (e.features)
          {
            var html = '';
            if (e.features.length > 1)
            {
              for(var f in e.features)
              {
                html += doBuildTemplate(e.features[f]);
              }

              html = '<div class="info_parent">' + html + '</div>';
            }
            else
            {
              html = doBuildTemplate(e.features[0]);
            }

            map.addPopup(new OpenLayers.Popup.FramedCloud(
              'Found',
              new OpenLayers.LonLat(e.features[0].geometry.x, e.features[0].geometry.y),
              null, html, null, true, function(e) {
                this.hide();
                $('#info_count, #prev, #next, div.info_parent, div.info').remove(); // destroy previous carousel elements
                OpenLayers.Event.stop(e);
              })
            );
            postPopup();
            if (e.features.length > 1)
            {
              carouselPopup();
            }
          }
      });

      return fc;
    },

    CLASS_NAME: 'NBT.Provider.ArcGIS'
});

/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * General functionality for setting up NBT OL-based webapps. Not much.
 *
 * @requires NBT.js
 */

NBT.App = OpenLayers.Class(NBT.Class, {

    GEOGRAPHIC: new OpenLayers.Projection('EPSG:4326'),
    SPHERICAL_MERCATOR: new OpenLayers.Projection('EPSG:3857'),

    /**
     * Whether to set OpenLayers.ProxyHost. Will look for proxyUrl property.
     */
    proxy: true,

    /**
     * The OpenLayers.Map instance.
     */
    map: null,

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);

      if (this.proxy)
      {
        OpenLayers.ProxyHost = this.proxyUrl;
      }

      this.preMapInit();
      this.mapInit();
      this.postMapInit();
    },

    preMapInit: function() {
    },

    getMapOptions: function() {
      return {};
    },

    getMap: function() {
      return this.map;
    },

    mapInit: function() {
      var mapOptions = this.getMapOptions();
      this.map = new OpenLayers.Map('map', mapOptions);
    },

    postMapInit: function() {
    },

    /**
     * Add a function to a given button's onclick, and make the enter key on a
     * given textbox run the same function.
     */
    setupButtonEnterKey: function(buttonId, textInputId, onclickFunction)
    {
      $('#' + buttonId).click(onclickFunction);
      $('#'+ textInputId).bind('keypress', function(e)
      {
        if (e.keyCode == 13)
        {
          $('#' + buttonId)[0].click();
        }
      });
    },

    /**
     * Given a list of features, return only those that intersect the given extent.
     *
     * features: array of {OpenLayers.Feature}
     * extent: {OpenLayers.Bounds}
     */
    getFeaturesWithinExtent: function(features, extent) {
      // this silly bit is because IE8 doesn't support .filter out of the box.
      // this will just insert it once if needed...
      // TODO: consider throwing this into a util function here.
      if (!Array.prototype.filter)
      {
        Array.prototype.filter = function (fun /*, thisp */) {

          "use strict";

          if (this == null)
          {
            throw new TypeError();
          }

          var t = Object(this);
          var len = t.length >>> 0;
          if (typeof fun != "function")
            throw new TypeError();

          var res = [];
          var thisp = arguments[1];
          for (var i = 0; i < len; i++)
          {
            if (i in t)
            {
              var val = t[i]; // in case fun mutates this
              if (fun.call(thisp, val, i, t))
                res.push(val);
            }
          }

          return res;
        }
      }

      var inExtent = features.filter(function(feat) {
        return extent.containsBounds(feat.geometry.bounds);
      });

      return inExtent;
    },

    /**
     * features: Vector features collection.
     * center: Where to start - {OpenLayers.Point}
     * radius: How far to highlight, in map units.
     */
    getFeaturesWithinDistance: function(features, center, radius) {
      // first, get the features within the bbox extent created by center/radius.
      // then, check each of those to remove the 'corner' ones.
      var bbox = OpenLayers.Bounds.fromArray([center.x - radius, center.y - radius, center.x + radius, center.y + radius]);
      var boxFiltered = getFeaturesWithinExtent(features, bbox);

      var out = [];
      for (var i = 0; i < boxFiltered.length; i++)
      {
        if (center.distanceTo(boxFiltered[i].geometry) <= radius)
        {
          out.push(boxFiltered[i]);
        }
      }

      return out;
    },

    /**
     * Lazy initialize a Marker Layer on the map.
     */
    getMarkerLayer: function(markerLayerName)
    {
      var map = this.getMap();
      var layers = map.getLayersByClass('OpenLayers.Layer.Markers');
      var markerLayer = null;
      for (var i = 0; i < layers.length; i++)
      {
        if (layers[i].name == markerLayerName)
        {
          markerLayer = layers[i];
        }
      }
      if (markerLayer == null) // lazy create
      {
        markerLayer = new OpenLayers.Layer.Markers(markerLayerName,
          {displayInLayerSwitcher: false});
        map.addLayer(markerLayer);
      }

      return markerLayer;
    },

    /**
     * Add a marker to the map generically. This assumes the center-bottom of the
     * icon is the point, pointing at the location.
     * Needs a base URL at the top for location of marker files.
     *
     * markerLayer: name of the marker layer.
     * lonLat: where to put it {OpenLayers.LonLat}
     * url: url to hit the image used for the marker
     * w: width of file
     * h: height of file
     */
    addMarker: function(markerLayerName, lonLat, url, w, h, offset)
    {
      var markerLayer = this.getMarkerLayer(markerLayerName);

      var size = new OpenLayers.Size(w,h);
      if (!offset)
      {
        // if not set, assume it's a pointer with the bottom center being the pin.
        offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
      }
      var icon = new OpenLayers.Icon(url, size, offset);
      markerLayer.addMarker(new OpenLayers.Marker(lonLat, icon));
    },

    clearMarkers: function(markerLayerName)
    {
      var markerLayer = this.getMarkerLayer(markerLayerName);

      if (typeof(markerLayer) != 'undefined')
      {
        var mks = markerLayer.markers;
        markerLayer.clearMarkers();
        for (var marker in mks) //clean up for memory.
        {
          if(marker.destroy) marker.destroy();
        }
      }
    },

    /**
     * Find a Control object on the map given its class name. The entire name
     * is not required, just enough to make it unique (or you'll get the first
     * match otherwise).
     */
    getControlByClassName: function(control)
    {
      for (var i in this.map.controls)
      {
        if (this.map.controls[i].CLASS_NAME.indexOf(control) != -1)
        {
          return this.map.controls[i];
        }
      }
    },

    CLASS_NAME: 'NBT.App'
});


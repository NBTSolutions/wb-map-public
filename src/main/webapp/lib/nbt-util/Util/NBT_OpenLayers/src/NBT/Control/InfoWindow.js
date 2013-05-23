/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Class to handle info window popups.
 * I'm not sure how much of this can be solidly generic and how much must be
 * client-specific yet.
 *
 * @requires NBT.js
 */

NBT.Control.InfoWindow = OpenLayers.Class(NBT.Control, {

    /**
     * Vector layers that can be used for selection.
     */
    layers: [],

    /**
     * SelectFeature control controlled by this class.
     */
    selectControl: null,

    templateText: null,

    templateUrl: 'info_template.html',

    /**
     * Set this to a function that takes a key/value pair and returns the value,
     * modified if necessary.
     */
    processInfoWindowValue: null,

    /**
     * Set this to a function to do something custom after a feature is unselected.
     * It'll get appended to the onfeatureunselect event in SelectFeature.
     */
    doOnUnselect: null,

    initialize: function(options) {
      OpenLayers.Util.extend(this, options);
    },

    setupSelect: function(options) {
      // default options.
      OpenLayers.Util.applyDefaults(options, {
          clickout: true, toggle: false,
          multiple: false, hover: false,
      });

      this.selectControl = new OpenLayers.Control.SelectFeature(this.layers, options);
    },

    /**
     * Activate selectControl on the given map, and set up listeners for the
     * attached layers.
     */
    activateSelect: function(map) {

      if (this.selectControl == null)
      {
        this.setupSelect();
      }

      map.addControl(this.selectControl);
      this.selectControl.activate();

      for (var i in this.selectControl.layer.layers)
      {
        this.selectControl.layer.layers[i].infoWindow = this;
        this.selectControl.layer.layers[i].events.on({
            "featureselected": function(e) {
              var iw = e.object.infoWindow;
              iw.onFeatureSelect(e.feature);
            },
            "featureunselected": function(e) {
              var iw = e.object.infoWindow;
              iw.onFeatureUnselect(e.feature);
            }
        });
      }
    },

    onFeatureSelect: function(feature) {

      if (this.templateText == null)
      {
        this.templateText = this.getTemplate(this.templateUrl);
      }

      var info = this.templateText; // make a copy so original can be reused...
      // attempt to replace any/all attributes of the feature.
      for (var key in feature.attributes)
      {
        var regex = new RegExp('#' + key + '#', 'g');
        var value = feature.attributes[key];
        if (value == null)
        {
          value = '';
        }

        // do client-specific rule processing on the value:
        if (typeof(this.processInfoWindowValue) == 'function')
        {
          value = this.processInfoWindowValue(key, value);
        }

        info = info.replace(regex, value);
      }

      // do any extra info window processing:
      if (typeof(this.postAttributeInfoWindow) == 'function')
      {
        info = this.postAttributeInfoWindow(feature, info);
      }

      popup = new OpenLayers.Popup.FramedCloud("Feature Information",
        feature.geometry.getBounds().getCenterLonLat(),
        null, info,
        null, true, this.onPopupClose);

      feature.popup = popup; // lets you grab it in unselect.
      popup.infoWindow = this;
      popup.feature = feature;

      this.selectControl.map.addPopup(popup);
      if (typeof(this.postPopup) == 'function')
      {
        this.postPopup(feature);
      }
    },

    onFeatureUnselect: function(feature) {
      if (feature.popup) {
        popup.feature = null;
        this.selectControl.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
      }

      if (typeof(this.doOnUnselect) == 'function')
      {
        this.doOnUnselect(feature);
      }
    },

    onPopupClose: function() {
      // 'this' is the popup.
      if (typeof(this.infoWindow.selectControl) != 'undefined')
      {
        this.infoWindow.selectControl.unselect(this.feature);
      }
    },

    CLASS_NAME: 'NBT.Control.InfoWindow'
});

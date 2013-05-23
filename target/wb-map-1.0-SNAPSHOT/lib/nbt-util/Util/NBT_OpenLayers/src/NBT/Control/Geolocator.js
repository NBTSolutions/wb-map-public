/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Class to handle geolocation services.
 *
 * @requires NBT/Control.js
 */

NBT.Control.Geolocator = OpenLayers.Class(NBT.Control, {

  /**
   * Geolocate OL Control, lazy-initialized.
   */
  control: null,

  /**
   * The current OL Map object, required on init.
   */
  map: null,

  /**
   * JQuery object to bind a click to to make it go, really required on init.
   */
  element: null,

  showEstimateCircle: false,

  /**
   * Style hash to use for displaying the geolocation point.
   */
  locateStyle: {
    graphicName: 'star',
    strokeColor: '#f00',
    strokeWidth: 2,
    fillOpacity: 0,
    pointRadius: 8
  },

  /**
   * Optional styling for an 'estimate' circle to encompass the geolocated point.
   */
  estimateStyle: {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
  },

  /**
   * Flag to know whether a geolocate has been performed.
   */
  firstGeolocate: true,

  initialize: function(options) {
    OpenLayers.Util.extend(this, options);

    this.geolocateLayer = new OpenLayers.Layer.Vector('geolocate');
    this.geolocateLayer.displayInLayerSwitcher = false;

    var geolocateOptions = OpenLayers.Util.applyDefaults({
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    }, options.geolocationOptions);

    this.control = new OpenLayers.Control.Geolocate({
        bind: false,
        geolocationOptions: geolocateOptions
    });

    this.map.addControl(this.control);

    this.control.events.register("locationupdated", this, this.handleGeolocate);

    this.map.addLayers([this.geolocateLayer]);

    if (this.element != null)
    {
      this.element.data('geolocate', this);
      if (typeof(options.postGeolocate) == 'function')
      {
        this.element.data('postGeolocate', options.postGeolocate);
      }

      this.element.click(function() {
          var el = $(this);
          el.data('geolocate').doGeolocate();
          if (typeof(el.data('postGeolocate')) == 'function')
          {
            el.data('postGeolocate')();
          }
      });
    }
  },

  clearGeolocation: function() {
    if (this.geolocateLayer.features)
    {
      this.geolocateLayer.removeAllFeatures();
    }
  },

  /**
   * Perform the geolocate by activating the Geolocate Control object.
   */
  doGeolocate: function()
  {
    this.geolocateLayer.removeAllFeatures();
    this.control.deactivate();
    this.control.watch = false;
    this.firstGeolocate = true;
    this.control.activate();
  },

  /**
   * Handles the result of the Control finding the user's location.
   *
   * - e: {Event} hash that includes 'point', the x/y location discovered.
   */
  handleGeolocate: function(e)
  {
    this.geolocateLayer.removeAllFeatures();

    // new features array starting with the location point.
    var newFeatures = [new OpenLayers.Feature.Vector(
        e.point,
        {},
        this.locateStyle
    )];

    if (this.showEstimateCircle)
    {
      var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
          new OpenLayers.Geometry.Point(e.point.x, e.point.y),
          e.position.coords.accuracy/2, 40, 0), {}, this.estimateStyle);

      newFeatures.push(circle);
    }

    this.geolocateLayer.addFeatures(newFeatures);

    if (this.firstGeolocate) {
      this.map.zoomToExtent(this.geolocateLayer.getDataExtent());
      if (this.map.getZoom() > 15)
      {
        this.map.zoomTo(15);
      }
      this.firstGeolocate = false;
      //this.bind = true;
    }
  },

  CLASS_NAME: 'NBT.Control.Geolocator'
});

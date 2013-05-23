/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Strategy.js
 */

/**
 * This class solves a couple needs:
 * 1. Only ever request the full WFS feature set once - that is expensive due
 * to network overhead.
 * 2. Only hand off what's needed to draw the map based on BBOX map extent.
 * This reduces the work required by the browser.
 *
 * So essentially, it's a combination of Strategy.BBOX and Strategy.Fixed.
 * But it also allows a Filter to be used in the retrieval as well.
 *
 * Inherits from:
 *  - <OpenLayers.Strategy>
 */
NBT.Strategy.FixedFilter = OpenLayers.Class(OpenLayers.Strategy, {

    /**
     * APIProperty: preload
     * {Boolean} Load data before layer made visible. Enabling this may result
     *   in considerable overhead if your application loads many data layers
     *   that are not visible by default. Default is false.
     */
    preload: false,

    /**
     * APIProperty: filter
     * {<OpenLayers.Filter>}  Filter for limiting features sent to the layer.
     *     Use the <setFilter> method to update this filter after construction.
     */
    filter: null,

    /**
     * Property: cache
     * {Array(<OpenLayers.Feature.Vector>)} List of features, once retrieved
     *   will never change.
     */
    cache: null,

    /**
     * Constructor: OpenLayers.Strategy.FixedFilter
     * Create a new FixedFilter strategy.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     instance.
     */

    /**
     * Method: activate
     * Activate the strategy: load data or add listener to load when visible
     *
     * Returns:
     * {Boolean} True if the strategy was successfully activated or false if
     *      the strategy was already active.
     */
    activate: function() {

        if(OpenLayers.Strategy.prototype.activate.apply(this, arguments)) {
            this.layer.events.on({
                "refresh": this.load,
                scope: this
            });
            if(this.layer.visibility == true || this.preload) {
                this.load();
            } else {
                this.layer.events.on({
                    "visibilitychanged": this.load,
                    scope: this
                });
            }
            return true;
        }
        return false;
    },

    /**
     * Method: deactivate
     * Deactivate the strategy.  Undo what is done in <activate>.
     *
     * Returns:
     * {Boolean} The strategy was successfully deactivated.
     */
    deactivate: function() {

      var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.layer.events.un({
                "refresh": this.load,
                "visibilitychanged": this.load,
                scope: this
            });
        }
        return deactivated;
    },

    /**
     * Method: load
     * Tells protocol to load data and unhooks the visibilitychanged event,
     * Refreshes the filter cache when called via refresh() during operation.
     *
     * Parameters:
     * options - {Object} options to pass to protocol read.
     */
    load: function(options) {

        if (this.cache == null || options.force)
        {
          var layer = this.layer;
          layer.events.triggerEvent("loadstart");
          layer.protocol.read(OpenLayers.Util.applyDefaults({
              callback: OpenLayers.Function.bind(this.merge, this,
                  layer.map.getProjectionObject()),
              filter: layer.filter
          }, options));
          layer.events.un({
              "visibilitychanged": this.load,
              scope: this
          });

          layer.events.on({
              "moveend": this.update,
              scope: this
          });
          layer.events.on({
              "refresh": this.update,
              scope: this
          });
        }
        else
        {
          // gets called on zoom or move actions.
          this._updateLayer();
        }
    },

    /**
     * Method: merge
     * Add all features to the layer.
     *
     * Parameters:
     * mapProjection - {OpenLayers.Projection} the map projection
     * resp - {Object} options to pass to protocol read.
     */
    merge: function(mapProjection, resp) {

        var layer = this.layer;
        layer.destroyFeatures();
        var features = resp.features;
        this.cache = features;
        if (features && features.length > 0) {
            if(!mapProjection.equals(layer.projection)) {
                var geom;
                for(var i=0, len=features.length; i<len; ++i) {
                    geom = features[i].geometry;
                    if(geom) {
                        geom.transform(layer.projection, mapProjection);
                    }
                }
            }

            // always filter will return just those in the bounding box.
            features = this.doFilter();
            layer.addFeatures(features);
        }
        layer.events.triggerEvent("loadend");
    },

    /**
     * Method: doFilter
     * Called at beforefeaturesadded on the layer, clears the layer's list of
     * features and replaces it with a new collection, based on the map bounds
     * and an optional spatial filter (such as state/county boundary).
     *
     * If there are performance issues, this is a good place to start - there
     * was a filterCache here, but I had to remove it to get it to handle on-screen
     * drawing and calculation of features within a filtered set correctly. But
     * that's on me, not the idea of caching the filter, you shouldn't have to
     * do that all the damned time.
     */
    doFilter: function() {

        // this is only used early on before the data is loaded from the server.
        if (this.cache == null)
        {
          return [];
        }

        // do bbox intersection for features before any expensive filtering.
        var bounds = this.layer.map.getExtent();
        if (this.filter != null && this.filter.CLASS_NAME == 'OpenLayers.Filter.Spatial')
        {
          // in this case, .value will always be a geometry.
          var filBounds = this.filter.value.getBounds();
          // get the intersection of the two:
          if (bounds.top < filBounds.bottom ||
            bounds.bottom > filBounds.top ||
            bounds.left > filBounds.right ||
            bounds.right < filBounds.left)
          {
            return []; // filter bounds and map don't intersect, NO features can be in there!
          }
          if (bounds.top > filBounds.top) { bounds.top = filBounds.top; }
          if (bounds.bottom < filBounds.bottom) { bounds.bottom = filBounds.bottom; }
          if (bounds.left < filBounds.left) { bounds.left = filBounds.left; }
          if (bounds.right > filBounds.right) { bounds.right = filBounds.right; }
        }

        var bbox = bounds.toGeometry();
        var tempSet = [];
        for (var i = 0; i < this.cache.length; i++)
        {
          var feature = this.cache[i];
          if (bbox.intersects(feature.geometry))
          {
            tempSet.push(feature);
          }
        }

        if (this.filter == null)
        {
          return tempSet;
        }
        else
        {
          var newSet = [];

          for (var i = 0; i < tempSet.length; i++)
          {
            var feature = tempSet[i];
            if (this.filter.evaluate(feature))
            {
              newSet.push(feature);
            }
          }

          return newSet;
        }
    },

    /**
     * APIMethod: setFilter
     * Update the filter for this strategy. This will re-evaluate
     *     any features on the layer and in the cache. Only features
     *     for which filter.evalute(feature) returns true will be
     *     added to the layer.  Others will remain cached by the strategy.
     *
     * Parameters:
     * filter - <OpenLayers.Filter> A filter for evaluating features.
     */
    setFilter: function(filter) {
        this.filter = filter;
        this._updateLayer();
    },

    update: function() {
      this._updateLayer();
    },

    _updateLayer: function() {
      this.layer.removeAllFeatures();
      var f = this.doFilter();
      this.layer.addFeatures(f);
      this.layer.events.triggerEvent('layerupdated', {full: true});
    },

    CLASS_NAME: "NBT.Strategy.FixedFilter"
});

/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * OpenLayers.Rule can't handle Cluster objects correctly, so I am attempting
 * to fix that.
 *
 * @requires NBT.js
 */
NBT.Rule = OpenLayers.Class(OpenLayers.Rule, {

    /**
     * Method: getContext
     * Overriding the original getContext() to enable the use of clustered
     * features, which end up looking different.
     *
     * Paramters:
     * feature - {<OpenLayers.Feature>} feature to take the context from if
     *           none is specified.
     */
    getContext: function(feature) {
        var context = this.context;
        if (!context) {
          if (feature.cluster)
          {
            context = feature;
          }
          else
          {
            context = feature.attributes || feature.data;
          }
        }
        if (typeof this.context == "function") {
            context = this.context(feature);
        }
        return context;
    },

});

/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent class for vendor-specific data format manipulation.
 *
 * @requires NBT.js
 */

NBT.Format = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Format'
});


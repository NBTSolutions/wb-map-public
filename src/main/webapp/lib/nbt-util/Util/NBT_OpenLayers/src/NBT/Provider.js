/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent class for vendor-specific data providers.
 *
 * @requires NBT.js
 */

NBT.Provider = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Provider'
});


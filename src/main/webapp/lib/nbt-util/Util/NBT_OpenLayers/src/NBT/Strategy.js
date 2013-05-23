/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent class for local Strategies.
 *
 * @requires NBT.js
 */

NBT.Strategy = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Strategy'
});


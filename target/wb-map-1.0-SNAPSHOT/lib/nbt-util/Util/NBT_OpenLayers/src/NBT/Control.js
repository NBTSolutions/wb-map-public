/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent container for Control objects.
 *
 * @requires NBT.js
 */

NBT.Control = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Control'
});


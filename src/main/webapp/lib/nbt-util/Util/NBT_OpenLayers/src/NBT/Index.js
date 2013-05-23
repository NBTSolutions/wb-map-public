/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent Index class, does nothing yet, could end up as an 'Interface'?
 *
 * @requires NBT.js
 */

NBT.Index = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Index'
});


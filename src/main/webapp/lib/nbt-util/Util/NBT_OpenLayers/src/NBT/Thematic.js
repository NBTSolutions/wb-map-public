/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent container for Thematic objects.
 *
 * @requires NBT.js
 */

NBT.Thematic = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Thematic'
});


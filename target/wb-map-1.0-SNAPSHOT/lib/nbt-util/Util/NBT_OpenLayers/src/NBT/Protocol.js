/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Parent container for Protocol objects, which won't extend this one, but it
 * needs to be here for packaging purposes.
 *
 * @requires NBT.js
 */

NBT.Protocol = OpenLayers.Class(NBT.Class, {

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    CLASS_NAME: 'NBT.Protocol'
});


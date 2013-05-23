/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Class to contain functionality to clear selections. Not sure this needs to be
 * a separate control, but why not.
 *
 * @requires NBT.js
 */

NBT.Control.ClearSelection = OpenLayers.Class(NBT.Control, {

    /**
     * Element (jquery) to attach a click() that'll run all the defined clear
     * actions.
     */
    button: null,

    /**
     * Array of functions that'll be run when this control is activated.
     */
    actions: [],

    /**
     * If set, the NBT.App that will be passed in to all the action functions.
     */
    app: null,

    initialize: function(options) {
      OpenLayers.Util.extend(this, options);

      if (this.button != null)
      {
        this.button.data('nbt.clear', this);
        this.button.click(function() {
            var clear = $(this).data('nbt.clear');
            clear.doActions();
        });
      }
    },

    doActions: function() {
      for (var i in this.actions)
      {
        this.actions[i](this.app);
      }
    },

    CLASS_NAME: 'NBT.Control.ClearSelection'
});

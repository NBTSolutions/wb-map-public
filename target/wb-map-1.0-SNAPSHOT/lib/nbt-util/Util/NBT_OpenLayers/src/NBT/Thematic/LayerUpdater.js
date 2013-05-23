/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Read incoming data structure and add given data to a Vector Layer's attributes.
 *
 * @requires NBT.js
 */
NBT.Thematic.LayerUpdater = OpenLayers.Class(NBT.Class, {

    layer: null,

    initialize: function(options)
    {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Add data based on simple array of arrays. Requires a 'key' array to be
     * passed in too so we know what attributes to create.
     */
    addArrayData: function(fieldNames, keyField, data)
    {
      // TODO: Find a better way to find the layer feature.

      var idField = ''; // used to find matching Feature.
      var idFieldNum = 0;
      if (isNaN(keyField))
      {
        idField = keyField;
        for (var i in fieldNames)
        {
          if (fieldNames[i].toUpperCase() == keyField.toUpperCase())
          {
            idFieldNum = i;
          }
        }
      }
      else
      {
        // TODO: regex this against field names in feature[0] and match the case
        idField = fieldNames[keyField];
        idFieldNum = keyField;
      }

      for (var i in data)
      {
        var idValue = data[i][idFieldNum];
        // find the right feature:
        for (var f in this.layer.features)
        {
          if (this.layer.features[f].attributes[idField] == data[i][idFieldNum])
          {
            for (var j in fieldNames)
            {
              if (!this.layer.features[f].attributes[fieldNames[j]])
              {
                this.layer.features[f].attributes[fieldNames[j]] = data[i][j];
              }
            }
            break;
          }
        }
      }
    },

    CLASS_NAME: 'NBT.Thematic.LayerUpdater'
});

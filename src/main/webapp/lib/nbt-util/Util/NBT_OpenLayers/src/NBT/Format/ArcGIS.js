/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Ability to transform ArcGIS json response from /identify call to vector
 * Feature objects.
 *
 * @requires ?
 */
NBT.Format.ArcGIS = OpenLayers.Class(OpenLayers.Format, {

    /**
     * All I need right now is a read function that returns a collection of
     * features from the json output of an /identify call.
     */
    read: function(json)
    {
      var features = [];

      var obj = json;
      if (typeof(obj) == 'string')
      {
        obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json]);
      }

      if (!obj) {
        // find a good way to report this.
        return false;
      }

      if (obj.results)
      {
        for (var i in obj.results)
        {
          var f = obj.results[i];
          if (f.geometry)
          {
            var geom = null;
            switch (f.geometryType) {
            case 'esriGeometryPoint':
              geom = new OpenLayers.Geometry.Point(f.geometry.x, f.geometry.y);
            }

            var v = new OpenLayers.Feature.Vector(geom, f.attributes);
            v.layer = f.layerName.toLowerCase(); // cheating here.

            features.push(v);
          }
        }
      }

      return features;
    },

    CLASS_NAME: 'NBT.Format.ArcGIS'
});

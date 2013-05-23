/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * A simple spatial index (quad-tree) used for holding a bunch of vector
 * features and retrieving them more efficiently than going thru the whole
 * list.
 *
 * @requires NBT.js
 * @requires JQuery (for containsAll function)
 */

NBT.Index.SimpleQuad = OpenLayers.Class(NBT.Class, { // TODO Index super class eventually.

    index: null,

    extent: null,

    initialize: function(features, config)
    {
      OpenLayers.Util.extend(this, config);

      // initialize the index:
      this.index = {};

      var width = 0;
      var height = 0;

      var calcExtent = (this.extent == null);

      for (var i = 0; i < features.length; i++)
      {
        if (this.extent == null)
        {
          this.extent = new OpenLayers.Bounds();
        }

        var fb = null;
        if (features[i].geometry.bounds != null)
        {
          fb = features[i].geometry.bounds;
        }
        else
        {
          fb = features[i].geometry.getBounds(); // will calculate if needed.
        }

        if (calcExtent)
        {
          this.extent.extend(fb);
        }

        width += fb.getWidth();
        height += fb.getHeight();
      }

      width /= features.length;
      height /= features.length;

      width = Math.max( width, this.extent.getWidth()/Math.sqrt( features.length ) );
      height = Math.max( height, this.extent.getHeight()/Math.sqrt( features.length ) );

      // double it, approximately four features should fit. This should be about
      // the minimum index level.
      width *= 2;
      height *= 2;

      // insert each feature in the index.
      for (var i = 0; i < features.length; i++)
      {
        this._createCells(features[i], this.index, this.extent, width, height);
      }

      this._removeRedundant(this.index, this.extent);

    },

    /**
     * Recursive function to insert a feature in the correct 'bucket' in the
     * index.
     *
     * @param feature Feature to be added.
     * @param index The spatial index, needed for recursing down the tree.
     * @param overall The Extent of the index at the current level
     * @param width Minimum sector width
     * @param height Minimum sector height
     */
    _createCells: function(feature, index, overall, width, height)
    {
      if( overall.getWidth() <= width || overall.getHeight() <= height )
      {
        var features = index[overall];
        if (typeof(features) == 'undefined')
        {
          features = [];
          index[overall] = features;
        }
        features.push(feature);
      }
      else
      {
        var level = index[overall];
        if (level == null)
        {
          level = {};
          index[overall] = level;
        }

        var halfW = overall.getWidth() / 2;
        var halfH = overall.getHeight() / 2;

        // sw first
        var quad = new OpenLayers.Bounds(overall.left, overall.bottom, overall.left + halfW, overall.bottom + halfH);
        if (quad.intersectsBounds(feature.geometry.getBounds()))
        {
          if (quad.toGeometry().intersects(feature.geometry))
          {
            this._createCells(feature, level, quad, width, height);
          }
        }

        // nw
        quad = new OpenLayers.Bounds(overall.left, overall.top - halfH, overall.left + halfW, overall.top);
        if (quad.intersectsBounds(feature.geometry.getBounds()))
        {
          if (quad.toGeometry().intersects(feature.geometry))
          {
            this._createCells(feature, level, quad, width, height);
          }
        }

        // ne
        quad = new OpenLayers.Bounds(overall.right - halfW, overall.top - halfH, overall.right, overall.top);
        if (quad.intersectsBounds(feature.geometry.getBounds()))
        {
          if (quad.toGeometry().intersects(feature.geometry))
          {
            this._createCells(feature, level, quad, width, height);
          }
        }

        // se
        quad = new OpenLayers.Bounds(overall.right - halfW, overall.bottom, overall.right, overall.bottom + halfH);
        if (quad.intersectsBounds(feature.geometry.getBounds()))
        {
          if (quad.toGeometry().intersects(feature.geometry))
          {
            this._createCells(feature, level, quad, width, height);
          }
        }
      }
        // TODO: Must find a way to cache this.
    },

    _removeRedundant: function(current, currentExtent)
    {
      for (var extent in current)
      {
        var obj = current[extent];
        // each key in the 'current' index is an array or a table:
        if (! (obj instanceof Array))
        {
          obj = this._removeRedundant(obj, extent);
        }

        current[extent] = obj;
      }

      var groups = {};
      var hashes = {};
      for (var extent in current)
      {
        var obj = current[extent];
        if (obj instanceof Array)
        {
          var added = false;
          for (var group in groups)
          {
            if (this.containsAll(obj, group))
            {
              var orig = groups[group];
              orig.extend(extent);
              added = true;
              break;
            }
          }
          if (!added)
          {
            groups[obj] = extent;
          }
        }
        else
        {
          hashes[extent] = obj;
        }
      }

      if (groups.length + hashes.length < current.length)
      {
        var better = {};
        var sameSize = false;
        for (var group in groups)
        {
          var env = groups[group];
          if (env.getWidth() == currentExtent.getWidth() && env.getHeight() == currentExtent.getHeight())
          {
            sameSize = true;
          }

          better[env] = group;
        }

        for (var hash in hashes)
        {
          better[hash] = hashes[hash];
        }

        if (better.length == 1 || !sameSize)
        {
          return better;
        }
      }

      return current;
    },

    containsAll: function(needles, haystack)
    {
      for(var i = 0; i < needles.length; i++)
      {
         if ($.inArray(needles[i], haystack) == -1)
         {
           return false;
         }
      }
      return true;
    },

    /**
     * Return features that intersect with target:
     */
    getIntersecting: function(geom, index, boundsOnly)
    {
      if (typeof(index) == 'undefined' || index == null)
      {
        index = this.index;
      }

      var out = {};
      var geomBounds = geom.getBounds();

      for (var env in index)
      {
        console.log(typeof(env));
        console.log('e');
        if (env.toGeometry().intersects(geom))
        {
          var obj = index[env];
          if (obj instanceof Array)
          {
            for (var i = 0; i < obj.length; i++)
            {
              var feature = obj[i];
              if (typeof(out[feature.id]) != 'undefined' &&
                  feature.geometry.getBounds().intersectsBounds(geomBounds))
              {
                if (boundsOnly || feature.geometry.intersects(geom))
                {
                  out[feature.id] = feature;
                }
              }
            }
          }
          else
          {
            var features = this.getIntersecting(geom, obj, boundsOnly);
            for (var f in features)
            {
              out[features[f].id] = features[f];
            }
          }
        }
      }

      var list = [];
      for (var o in out)
      {
        list.push(out[o]);
      }
      return list;
    },

    CLASS_NAME: 'NBT.Index.SimpleQuad'
});

/**
 * 'internal' class used as the key
 */
NBT.Index.SimpleQuad_Node = OpenLayers.Class(NBT.Class, {

    CLASS_NAME: 'NBT.Index.SimpleQuad_Node'
});

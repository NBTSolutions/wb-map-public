/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * A simple spatial index (quad-tree) used for holding a bunch of vector
 * features and retrieving them more efficiently (?) than going thru the whole
 * list.
 *
 * @requires NBT.js
 */

NBT.Index.QuadTree = OpenLayers.Class(NBT.Class, { // TODO Index super class eventually.

    maxFeatures: 4,

    maxDepth: 10,

    extent: null,

    // root Node in the tree.
    root: null,

    initialize: function(features, config)
    {
      OpenLayers.Util.extend(this, config);

      if (this.extent == null)
      {
        this.extent = new OpenLayers.Bounds();
        for (var i = 0; i < features.length; i++)
        {
          var fb = null;
          if (features[i].geometry.bounds != null)
          {
            fb = features[i].geometry.bounds;
          }
          else
          {
            fb = features[i].geometry.getBounds(); // will calculate if needed.
          }

          this.extent.extend(fb);
        }
      }

      if (features[0].geometry.CLASS_NAME == 'OpenLayers.Geometry.Point')
      {
        this.root = new NBT.Index.QuadTree.Node(this.extent, 0, this.maxFeatures, this.maxDepth );
      }
      else
      {
        this.root = new NBT.Index.QuadTree.BoundsNode(this.extent, 0, this.maxFeatures, this.maxDepth );
      }

      for (var f in features)
      {
        this.root.insert(features[f]);
      }
    },

    insert: function(feature)
    {

      if (feature instanceof Array)
      {
        for(var i = 0; i < feature.length; i++)
        {
          this.root.insert(feature[i]);
        }
      }
      else
      {
        this.root.insert(feature);
      }
    },

    clear: function()
    {
      this.root.clear();
    },

    getIntersecting: function(geom, boundsOnly, indexOnly)
    {
      if (this.extent.intersectsBounds(geom.getBounds()))
      {
        var boundedSet = this.root.retrieve(geom).slice(0);

        if (indexOnly)
        {
          return boundedSet;
        }

        var out = [];
        for (var i = 0; i < boundedSet.length; i++)
        {
          if (boundsOnly && geom.getBounds().intersectsBounds(boundedSet[i]))
          {
            out.push(boundedSet[i]);
          } else if (geom.intersects(boundedSet[i].geometry))
          {
            out.push(boundedSet[i]);
          }
        }

        return out;
      }

      return [];
    },

    CLASS_NAME: 'NBT.Index.QuadTree'
});

NBT.Index.QuadTree.Node = OpenLayers.Class(NBT.Class, {

    _bounds: null,

    _depth: 0,

    maxFeatures: 4,

    maxDepth: 10,

    features: null,

    nodes: null,

    // quadrants.
    SW: 0,
    NW: 1,
    NE: 2,
    SE: 3,

    quadBounds: null,

    initialize: function(bounds, depth, maxFeatures, maxDepth)
    {
      this._bounds = bounds;
      this.features = [];
      this.nodes = [];
      this.maxFeatures = maxFeatures;
      this.maxDepth = maxDepth;
      this._depth = depth;
      this.quadBounds = null;
    },

    insert: function(feature)
    {
      // if it has nodes, it won't have features:
      if(this.nodes.length)
      {
        var index = this._findIndex(feature.geometry);
        this.nodes[index].insert(feature);
        return;
      }

      this.features.push(feature);

      if(this._depth < this.maxDepth && this.features.length > this.maxFeatures)
      {
        this.subdivide();

        for(var i = 0; i < this.features.length; i++)
        {
          this.insert(this.features[i]);
        }

        this.features.length = 0;
      }
    },

    retrieve: function(geom)
    {
      console.log('attempting to retrieve from depth ' + this._depth + ' idx: ' + this._bounds);
      if(this.nodes.length)
      {
        console.log('keep digging');
        // unfortunately, since we're using 2d geometries to find stuff, we
        // could easily have that geom cross more than one index:
        var idx = this._findIndex(geom);
        var nodes = {};
        for (var i = 0; i < idx.length; i++)
        {
          var features = this.nodes[idx[i]].retrieve(geom);
          for (var f = 0; f < features.length; f++)
          {
            // use feature id to create a unique hash.
            nodes[ features[f].id ] = features[f];
          }
        }

        var out = [];
        for (var n in nodes)
        {
          out.push(nodes[n]);
        }

        return out;
      }

      return this.features;
    },

    _findIndex: function(geom)
    {
      var geomBounds = geom.getBounds();
      var quadBounds = this._getQuads();
      var idx = [];
      for (var i in quadBounds)
      {
        if (quadBounds[i].intersectsBounds(geomBounds))
        {
          idx.push(i);
        }
      }

      return idx;
    },

    _getQuads: function(bounds)
    {
      if (this.quadBounds == null)
      {
        this.quadBounds = [];
        var b = this._bounds;
        var halfW = b.getWidth() / 2;
        var halfH = b.getHeight() / 2;

        // sw first:
        this.quadBounds.push(new OpenLayers.Bounds(b.left, b.bottom, b.left + halfW, b.bottom + halfH));
        this.quadBounds.push(new OpenLayers.Bounds(b.left, b.top - halfH, b.left + halfW, b.top));
        this.quadBounds.push(new OpenLayers.Bounds(b.right - halfW, b.top - halfH, b.right, b.top));
        this.quadBounds.push(new OpenLayers.Bounds(b.right - halfW, b.bottom, b.right, b.bottom + halfH));
      }

      return this.quadBounds;
    },

    subdivide: function()
    {
      var depth = this._depth + 1;
      var quadBounds = this._getQuads();
      for (var qb in quadBounds)
      {
        this.nodes.push(new NBT.Index.QuadTree.Node(quadBounds[qb], depth, this.maxFeatures, this.maxDepth));
      }
    },

    clear: function()
    {
      this.features.length = 0;

      var len = this.nodes.length;
      for(var i = 0; i < len; i++)
      {
        this.nodes[i].clear();
      }

      this.nodes.length = 0;
    },

    CLASS_NAME: 'NBT.Index.QuadTree.Node'
});

NBT.Index.QuadTree.BoundsNode = OpenLayers.Class(NBT.Class, {

    initialize: function(features, depth, maxFeatures, maxDepth)
    {
    },

    CLASS_NAME: 'NBT.Index.QuadTree.BoundsNode'
});

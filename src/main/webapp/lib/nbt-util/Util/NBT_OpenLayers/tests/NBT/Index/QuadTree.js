module('NBT/Index/QuadTree.js');

function NBT_getFeatures()
{
  // creating a simple set of 100 features, each given an x/y from 0-9:
  var features = [];

  for (var y = 0; y < 100; y++)
  {
    for (var x = 0; x < 100; x++)
    {
      var geom = new OpenLayers.Geometry.Point(x,y);
      var f = new OpenLayers.Feature.Vector(geom, {'id': x + ',' + y});
      features.push(f);
    }
  }
  return features;
}

test('Index Only Bounds Check', function() {
    var si = new NBT.Index.QuadTree(NBT_getFeatures());
    var b = new OpenLayers.Bounds(4.5, 4.5, 5.5, 5.5);
    var f = si.getIntersecting(b.toGeometry(), null, true);
    equal(f.length, 16);
});

test('Index Only Bounds Check, fewer', function() {
    var si = new NBT.Index.QuadTree(NBT_getFeatures());
    var b = new OpenLayers.Bounds(5.5, 5.5, 6.5, 6.5);
    var f = si.getIntersecting(b.toGeometry(), null, true);
    equal(f.length, 4);
});

test('Retrieve 1 feature, bounds or real', function() {

    var si = new NBT.Index.QuadTree(NBT_getFeatures());

    var b = new OpenLayers.Bounds(4.5, 4.5, 5.5, 5.5);
    var geom = b.toGeometry();
    var f = si.getIntersecting(geom);
    equal(f.length, 1);
    equal(f[0].geometry.x, 5);
    equal(f[0].geometry.y, 5);

    // given b, even a bounds-only check should return just 1, since this is
    // only point in poly checking. The bounds check and actual intersects
    // check is the same for 1D point objects.
    f = si.getIntersecting(geom, true);
    equal(f.length, 1);
    equal(f[0].geometry.x, 5);
    equal(f[0].geometry.y, 5);
});

// only NW quad intersects with bounds this time.
test('Retrieve 1, fewer to test', function() {

    var si = new NBT.Index.QuadTree(NBT_getFeatures());

    var b = new OpenLayers.Bounds(5.5, 5.5, 6.5, 6.5);
    var geom = b.toGeometry();
    var f = si.getIntersecting(geom);
    equal(f.length, 1);
});

test('Just intersecting 10000 features', function() {
    var feat = NBT_getFeatures();
    var b = new OpenLayers.Bounds(5.5, 5.5, 6.5, 6.5);
    var geom = b.toGeometry();
    var out = [];
    for (var i = 0; i < feat.length; i++)
    {
      if (geom.intersects(feat[i].geometry))
      {
        out.push(feat[i]);
      }
    }

    equal(out.length, 1);
});


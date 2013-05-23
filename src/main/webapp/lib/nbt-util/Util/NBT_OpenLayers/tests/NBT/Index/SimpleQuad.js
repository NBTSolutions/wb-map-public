module('NBT/Index/SimpleQuad.js');
test('initialize', function() {

    // creating a simple set of 100 features, each given an x/y from 0-9:
    var features = [];

    for (var y = 0; y < 10; y++)
    {
      for (var x = 0; x < 10; x++)
      {
        var geom = new OpenLayers.Geometry.Point(x,y);
        var f = new OpenLayers.Feature.Vector(geom, {'id': x + ',' + y});
        features.push(f);
      }
    }

    var si = new NBT.Index.SimpleQuad(features);


    var b = new OpenLayers.Bounds(4.5, 4.5, 5.5, 5.5);
    var geom = b.toGeometry();
    var f = si.getIntersecting(geom);
    console.log(f);

    expect(0);

});

// test('add url', function() {
// });

/*
test('run', function() {
    var m = new NBT.Control.MultiRequester({ processUrl: 'http://localhost/nascsp/multirequester.php' });
    m.addUrl('http://23.21.95.235/ArcGIS/rest/services/NASCSP/NASCSP_CAA_Points/MapServer/identify?f=json&tolerance=5&mapExtent=-12816830.448546%2C3794355.232727%2C-9157637.0309877%2C5995741.6470336&imageDisplay=748%2C450%2C96&geometryType=esriGeometryEnvelope&geometry=-10975644.708412%2C4271050.3513964%2C-10951184.859364%2C4295510.2004443', function() { return true; });
    m.addUrl('http://23.21.95.235/ArcGIS/rest/services/NASCSP/NASCSP_CAA_Points/MapServer/identify?f=json&tolerance=5&mapExtent=-12816830.448546%2C3794355.232727%2C-9157637.0309877%2C5995741.6470336&imageDisplay=748%2C450%2C96&geometryType=esriGeometryEnvelope&geometry=-10095090.142689%2C4549892.6305419%2C-10070630.293642%2C4574352.4795898', function() { return false; });
    m.exec();

    expect(0);
});
 */

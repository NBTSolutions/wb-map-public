module('NBT/Protocol/MultiRequester.js');
test('initialize', function() {

    var m = new NBT.Protocol.MultiRequester();
    equal(m.CLASS_NAME, 'NBT.Protocol.MultiRequester', 'constructor');

    var purl = 'http://example.com';
    var aurl = 'http://test';
    var urls = {};
    // each url passed to the requester must be the url => formatter function.
    urls[aurl] = function() { return 'test'; };
    m = new NBT.Protocol.MultiRequester({ processUrl: purl, urls: urls});

    equal(m.processUrl, purl, 'process url got set');
    equal(m.urls, urls, 'call urls got set');
    equal(m.urls['http://test'](), 'test', 'return call was there');

});

test('add url', function() {
    var m = new NBT.Protocol.MultiRequester();

    m.addUrl('http://testx', function() { return 'test'; });
    equal(m.urls['http://testx'](), 'test', 'return call was there');
});

/*
test('run', function() {
    var m = new NBT.Control.MultiRequester({ processUrl: 'http://localhost/nascsp/multirequester.php' });
    m.addUrl('http://23.21.95.235/ArcGIS/rest/services/NASCSP/NASCSP_CAA_Points/MapServer/identify?f=json&tolerance=5&mapExtent=-12816830.448546%2C3794355.232727%2C-9157637.0309877%2C5995741.6470336&imageDisplay=748%2C450%2C96&geometryType=esriGeometryEnvelope&geometry=-10975644.708412%2C4271050.3513964%2C-10951184.859364%2C4295510.2004443', function() { return true; });
    m.addUrl('http://23.21.95.235/ArcGIS/rest/services/NASCSP/NASCSP_CAA_Points/MapServer/identify?f=json&tolerance=5&mapExtent=-12816830.448546%2C3794355.232727%2C-9157637.0309877%2C5995741.6470336&imageDisplay=748%2C450%2C96&geometryType=esriGeometryEnvelope&geometry=-10095090.142689%2C4549892.6305419%2C-10070630.293642%2C4574352.4795898', function() { return false; });
    m.exec();

    expect(0);
});
 */

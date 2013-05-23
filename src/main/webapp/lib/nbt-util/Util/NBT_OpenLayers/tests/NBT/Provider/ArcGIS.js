module('NBT/Provider/ArcGIS.js');
test('getCacheLayer with json-retrieved config', function() {
    var fakeUrl = 'http://example.com/#service#/rest';
    var a = new NBT.Provider.ArcGIS({
        baseRestUrl: fakeUrl
    });

    var options = {
        service: 'test_service',
        title: 'Test',
        nameField: 'name'
    };

    $.mockjax({
        url: fakeUrl.replace('#service#', options.service),
        responseText: {"currentVersion":10.03,"serviceDescription" : null,"mapName":"Layers","description":"","copyrightText":"","layers":[{"id":0,"name":"CAA","parentLayerId":-1,"defaultVisibility":true,"subLayerIds":null,"minScale":0,"maxScale":0}],"tables":[],"spatialReference":{"wkid":102100},"singleFusedMapCache":false,"initialExtent":{"xmin":-18261025.3287321,"ymin":1374894.59464176,"xmax":-6831522.03360822,"ymax":9378287.78930883,"spatialReference":{"wkid":102100}},"fullExtent":{"xmin":-18261025.3287321,"ymin":1748035.90249731,"xmax":-6831522.03360822,"ymax":9005146.48145329,"spatialReference":{"wkid":102100}},"units":"esriMeters","supportedImageFormatTypes":"PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,AI,BMP","documentInfo":{"Title":"","Author":"","Comments":"","Subject":"","Category":"","Keywords":"","Credits":""},"capabilities":"Map,Query,Data"}
    });

    var layer = a.getCacheLayer(options);

    equal(layer.CLASS_NAME, 'OpenLayers.Layer.ArcGISCache', 'Correct class returned');
    equal(layer.url, fakeUrl.replace('#service#', options.service), 'Correct URL');
    equal(layer.name, 'Test', 'Layer titled');
    equal(layer.projection, "EPSG:102100", 'Make sure details are set');
});

test('getFeatureControl', function() {
    var fakeUrl = 'http://test';
    var a = new NBT.Provider.ArcGIS({
        baseRestUrl: fakeUrl
    });

    var fc = a.getFeatureControl(null, {service: 'test_service'});

    equal(fc.CLASS_NAME, 'OpenLayers.Control.GetFeature', 'Correct class returned');
    equal(fc.protocol.CLASS_NAME, 'NBT.Protocol.MultiRequester', 'Right protocol');
});

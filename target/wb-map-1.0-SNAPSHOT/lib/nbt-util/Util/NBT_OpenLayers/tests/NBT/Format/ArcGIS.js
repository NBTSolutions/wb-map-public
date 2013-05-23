module('NBT/Format/ArcGIS.js');
test('read, transform to vector features', function() {
    // sample json string for reading:
    var json = '{"results":[{"layerId":0,"layerName":"CAA","value":"Lincoln County Human Services","displayFieldName":"AgencyName","attributes":{"OBJECTID":"645","Shape":"Point","ST":"NV","AgencyName":"Lincoln County Human Services","AgencyAcronym":"Null","StreetAddress":"1 Main Street","City_1":"Pioche","ZipCode":"89043-0539","ServiceArea":"Lincoln County","Phone":"(775) 962-5497  ","Website":"Null","TypeofEligibleEntity":"Local Government"},"geometryType":"esriGeometryPoint","geometry":{"x":-12740130.7093868,"y":4570864.21776572,"spatialReference":{"wkid":102100}}}]}';

    var a = new NBT.Format.ArcGIS();
    var features = a.read(json);

    equal(features.length, 1, '1 feature returned');
    equal(features[0].CLASS_NAME, 'OpenLayers.Feature.Vector', 'make sure it is a feature');
    equal(features[0].attributes.AgencyName, 'Lincoln County Human Services', 'attributes got set');
    equal(features[0].geometry.CLASS_NAME, 'OpenLayers.Geometry.Point', 'point got set');
    equal(features[0].geometry.x, -12740130.7093868, 'point got set to the right place');

});

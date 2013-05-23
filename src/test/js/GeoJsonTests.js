describe('Geojson Tests', function() {
    var data1 = [ ];
    beforeEach(function() {
        runs(function() {
            var ajax = new enyo.Ajax({
                url: "/src/test/resources/geojsontestdata.json"
            }).go().response(function(inSender, inResponse) {
                data1 = inResponse;
            });
        });
        waitsFor(function() {
            return data1.length > 0;
        }, "fail", 1000);
    });
    it('test geojson testdata availability', function() {
        expect(data1.length).toBe(22);
    });
    it('test geojson stratification proto logic', function() {
        var counts = _.countBy(data1, function(o) { return o.geometry.coordinates.join(","); });
        expect(_.values(counts).length).toBe(15);
        expect(_.max(_.values(counts))).toBeGreaterThan(2);
    });
});

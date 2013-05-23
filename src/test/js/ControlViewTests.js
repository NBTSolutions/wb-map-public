describe("wb.ControlView", function() {
    var map, $mapView, $ctrlView;
    beforeEach(function() {
        $mapView = window.enyo.$.map.$.mapView;
        $ctrlView = window.enyo.$.map.$.controlView;
        map = $mapView.getMap();
    });
    describe("sanity", function() {
        it("test Enyo component references", function() {
            expect(map).toBeDefined();
            expect($mapView).toBeDefined();
            expect($ctrlView).toBeDefined();
        });
    });
    describe("geo logic", function() {
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
            runs(function() {
                expect(data1.length).toBeGreaterThan(0);
            });
        });
        it("test geometry stratification", function() {
            var locationCounts = wb.MapView.stratifyObservationsByLocation(data1);
            expect(_.values(locationCounts).length).toBe(15);
        });
    });
    describe("layer control UI actions", function() {
        it("test [User Observation] layer toggle (OFF)", function() {
            enyo.Signals.send("onToggleObservation", { selected: false });
            $ctrlView.$.studentObservationSelect.setChecked(false);

            expect($mapView.userObsCluster._map).toBe(null);
        });
        it("test [User Observation] layer toggle (ON)", function() {
            enyo.Signals.send("onToggleObservation", { selected: true });
            $ctrlView.$.studentObservationSelect.setChecked(true);

            expect($mapView.userObsCluster._map).toBe(map);
        });
        it("test [School Weather Stations] layer toggle (OFF)", function() {
            enyo.Signals.send("onToggleSchool", { selected: false });
            $ctrlView.$.schoolLayerSelect.setChecked(false);

            expect($mapView.schoolCluster._map).toBe(null);
        });
        it("test [School Weather Stations] layer toggle (ON)", function() {
            enyo.Signals.send("onToggleSchool", { selected: true });
            $ctrlView.$.schoolLayerSelect.setChecked(true);

            expect($mapView.schoolCluster._map).toBe(map);
        });
        it("test [Buoys] layer toggle (OFF)", function() {
            enyo.Signals.send("onToggleBuoy", { selected: false });
            $ctrlView.$.buoyLayerSelect.setChecked(false);

            expect($mapView.buoyCluster._map).toBe(null);
        });
        it("test [Buoys] layer toggle (ON)", function() {
            enyo.Signals.send("onToggleBuoy", { selected: true });
            $ctrlView.$.buoyLayerSelect.setChecked(true);

            expect($mapView.buoyCluster._map).toBe(map);
        });
        it("test [NOAA Radar] layer toggle (OFF)", function() {
            enyo.Signals.send("onToggleRadar", { selected: false });
            $ctrlView.$.radarLayerSelect.setChecked(false);

            expect($mapView.radarLayer._map).toBe(null);
        });
        it("test [NOAA Radar] layer toggle (ON)", function() {
            enyo.Signals.send("onToggleRadar", { selected: true });
            $ctrlView.$.radarLayerSelect.setChecked(true);

            expect($mapView.radarLayer._map).toBe(map);
        });
        it("test [NOAA Surface Temps] layer toggle (OFF)", function() {
            enyo.Signals.send("onToggleSeaTemp", { selected: false });
            $ctrlView.$.tempLayerSelect.setChecked(false);

            expect($mapView.seaTempLayer._map).toBe(null);
        });
        it("test [NOAA Surface Temps] layer toggle (ON)", function() {
            enyo.Signals.send("onToggleSeaTemp", { selected: true });
            $ctrlView.$.tempLayerSelect.setChecked(true);

            expect($mapView.seaTempLayer._map).toBe(map);
        });
    });
});

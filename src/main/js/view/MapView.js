enyo.kind({
    name: "wb.MapView",
    statics: {
        stratifyObservationsByLocation: function(observations) {
            return _.countBy(observations, function(o) { return o.geometry.coordinates.join(","); });
        },
        reverseCoordinates: function(coordinates) {
            return _.sortBy(coordinates, function(e, i) { return -i; });
        }
    },
    components: [
        {kind: "enyo.Signals",
            onToggleSchool: "doToggleSchoolLayer",
            onToggleBuoy: "doToggleBuoyLayer",
            onToggleObservation: "doToggleObservationLayer",
            onToggleRadar: "doToggleRadarLayer",
            onToggleSeaTemp: "doToggleSeaTempLayer"
        },
        {name: "mapContainer", classes: "enyo-fit"},
        {kind: "wb.ZoomControl"},
        {kind: "nbt.MapGrowl", name: "mapGrowl"}
    ],
    published: {
        map: null,
        oms: null,
        userObservationGroup: null
    },
    rendered: function() {
        this.map = L.map(this.$.mapContainer.getId(), {
            center: [ 43.133595,-68.32664 ],
            zoom: 7,
            maxZoom: 13,
            zoomControl: false,
            attributionControl: false
        });
        nbt.geo.leaflet.getNbtAttribution("bottomleft", "maroon").addTo(this.map);

        this.$.zoomControl.setMap(this.map);

        nbt.geo.leaflet.getArcGISTileLayer("Ocean_Basemap").addTo(this.map);
        
        this.userObsCluster = new L.MarkerClusterGroup({
            iconCreateFunction: function(cluster) {
                return wb.map.assets.userObservationCluster;
            },
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false
        });
        this.buoyCluster = new L.MarkerClusterGroup({
            iconCreateFunction: function(cluster) {
                return wb.map.assets.buoyObservationCluster;
            },
            spiderfyOnMaxZoom: true,
            spiderfyDistanceMultiplier: 2.5,
            showCoverageOnHover: false
        });
        this.schoolCluster = new L.MarkerClusterGroup({
            iconCreateFunction: function(cluster) {
                return wb.map.assets.schoolObservationCluster;
            },
            spiderfyOnMaxZoom: true,
            spiderfyDistanceMultiplier: 2.5,
            showCoverageOnHover: false
        });

        this.map.on("popupopen", function(e) {
            var observation = e.popup.options.observation;
            new enyo.JsonpRequest({
                url: wb.map.env.aggregatorService + "/observation/" + observation.properties.id,
                callbackName: "callback"
            }).go({
                callback: "cb",
                q: JSON.stringify({
                    sensorDescriptor: {
                        providerName: "User"
                    }
                })
            }).response(this, function(inSender, inResponse) {
                enyo.Signals.send("onObservationResponse", { observation: inResponse });
            });
            var point = this.map.latLngToContainerPoint(new L.LatLng(observation.geometry.coordinates[1], observation.geometry.coordinates[0]));
            var h = this.map.getSize().y;
            // TODO TWEAK
            this.map.panBy(new L.Point(0, -(h - point.y) + 20));
        }, this);

        // get all user observations
        this.observationLayer = L.layerGroup();
        this.schoolLayer = L.layerGroup();
        this.buoyLayer = L.layerGroup();

        // get radar data
         this.radarLayer = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
             layers: 'RAS_RIDGE_NEXRAD',
             format: 'image/png',
             transparent: true,
             attribution: "Weather: NOAA",
             opacity: 0.5
         });
         this.map.addLayer(this.radarLayer);

         // get sea temp data
         this.seaTempLayer = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
             layers: 'OBS_MAR_SSTF',
             format: 'image/png',
             transparent: true,
             attribution: "Weather: NOAA"
         });
         this.map.addLayer(this.seaTempLayer);

        // user overservations
        var queryUrl = wb.map.env.aggregatorService + "/observation/query";
        new enyo.JsonpRequest({ url: queryUrl, callbackName: "callback" }).go({
            callback: "cb",
            q: JSON.stringify({
                sensorDescriptor: {
                    providerName: "User"
                }
            })
        }).response(this, function(inSender, inResponse) {
            this.showObservations(inResponse, wb.map.assets.userObservationMarker, this.observationLayer, this.userObsCluster, wb.ObservationInfoWindow);
        });

        new enyo.JsonpRequest({ url: "//dev.nbtsolutions.net/schools.php", callbackName: "callback" }).go({
            callback: "cb",
            q: JSON.stringify({
                sensorDescriptor: {
                    providerName: "User"
                }
            })
        }).response(this, function(inSender, inResponse) {
            this.showObservations(inResponse, wb.map.assets.schoolObservationMarker, this.schoolLayer, this.schoolCluster);
        });

        new enyo.JsonpRequest({ url: "//dev.nbtsolutions.net/buoys.php", callbackName: "callback" }).go({
            callback: "cb",
            q: JSON.stringify({
                sensorDescriptor: {
                    providerName: "User"
                }
            })
        }).response(this, function(inSender, inResponse) {
            this.showObservations(inResponse, wb.map.assets.buoyObservationMarker, this.buoyLayer, this.buoyCluster);
        });
    },
    visitGeojsonCluster: function(markerIcon, layer, cluster, popup, group) {
        _.each(group, function(o) {
            var marker = L.marker(wb.MapView.reverseCoordinates(o.geometry.coordinates), { icon: markerIcon(group.length) });

            if (popup) {
                marker.bindPopup(
                    new popup({ observation: o }).render().hasNode(),
                    {
                        observation: o,
                        maxWidth: 9999,
                        autoPanPadding: new L.Point(10, 10),
                        autoPan: true
                    }
                );
            }

            cluster.addLayer(marker);
        }, this);
        /*
            marker.on("mouseover", enyo.bind(this, "updateContextualPopup", data));
        */
    },
    showObservations: function(observations, markerIcon, layer, cluster, popup) {
        var pillCounts = wb.MapView.stratifyObservationsByLocation(observations);
        var observationGroups = _.groupBy(observations, function(o) { return o.geometry.coordinates.join(","); });
        _.each(_.values(observationGroups), enyo.bind(this, "visitGeojsonCluster", markerIcon, layer, cluster, popup));

        cluster.addTo(this.map);
    },
    updateContextualPopup: function(data, e) {
        //if (!this.$.mapGrowl.showing) this.$.mapGrowl.show();
        //this.$.mapGrowl.setData(data);
    },
    doToggleSchoolLayer: function(inSender, inEvent) {
        inEvent.selected ? this.map.addLayer(this.schoolCluster) : this.map.removeLayer(this.schoolCluster);
    },
    doToggleObservationLayer: function(inSender, inEvent) {
        inEvent.selected ? this.map.addLayer(this.userObsCluster) : this.map.removeLayer(this.userObsCluster);
    },
    doToggleBuoyLayer: function(inSender, inEvent) {
        inEvent.selected ? this.map.addLayer(this.buoyCluster) : this.map.removeLayer(this.buoyCluster);
    },
    doToggleRadarLayer: function(inSender, inEvent) {
        inEvent.selected ? this.map.addLayer(this.radarLayer) : this.map.removeLayer(this.radarLayer);
    },
    doToggleSeaTempLayer: function(inSender, inEvent) {
        inEvent.selected ? this.map.addLayer(this.seaTempLayer) : this.map.removeLayer(this.seaTempLayer);
    }
});

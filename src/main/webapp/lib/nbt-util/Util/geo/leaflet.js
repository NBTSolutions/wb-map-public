var nbt = nbt || { };
nbt.geo = nbt.geo || { };

nbt.geo.leaflet = {
    /**
     * requires font-awesome
     */
    getNbtAttribution: function(pos, color) {
        return new L.Control.Attribution({
            position: pos || "bottomright",
            prefix: "<span style='font-size: 12px'>Powered by <a target='_blank' href='http://www.nbtsolutions.com' style='color: "+ (color || "#0078A8") +"'><i class='icon-map-marker'></i> NBT Solutions</a></span>"
        });
    },
    getNbtAttributionBasic: function(pos, color) {
        return new L.Control.Attribution({
            position: pos || "bottomright",
            prefix: "<span style='font-size: 12px'>Powered by <a target='_blank' href='http://www.nbtsolutions.com' style='color: "+ (color || "#0078A8") +"'>NBT Solutions</a></span>"
        });
    },
	getMapquestTileLayer: function() {
		return L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", {
            subdomains: '1234',
            attribution: "Tiles: <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>"
        });
	},	
	getArcGISTileLayer: function(layerName) {
		return L.tileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/"+layerName+"/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles: &copy; Esri"
        });
	}
};

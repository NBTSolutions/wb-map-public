wb.map.assets = {
    userObservationMarker: function(count) {
        return L.divIcon({
            className: "div_icon",
            html: "<img src='assets/user_icon.png'><div class='num_of_samples'>"+ count +"</div>",
            iconSize: [ 32, 32 ],
            popupAnchor: [ 0, -16 ]
        });
    },
	buoyObservationMarker: function(count) {
        return L.divIcon({
            className: "div_icon",
            html: "<img src='assets/buoy_icon.png'><div class='num_of_samples'>"+ count +"</div>",
            iconSize: [ 32, 32 ],
            popupAnchor: [ 0, -16 ]
        });
	},
	schoolObservationMarker: function(count) {
        return L.divIcon({
            className: "div_icon",
            html: "<img src='assets/station_icon.png'><div class='num_of_samples'>"+ count +"</div>",
            iconSize: [ 32, 32 ],
            popupAnchor: [ 0, -16 ]
        });
	},
    userObservationCluster: L.divIcon({
        className: "div_icon",
		html: "<img src='assets/user_icon.png'><div class='cluster_pill'>more</div>",
        iconSize: [ 32, 32 ]
    }),
	buoyObservationCluster: L.divIcon({
        className: "div_icon",
		html: "<img src='assets/buoy_icon.png'><div class='cluster_pill'>more</div>",
		iconSize: [ 32, 32 ]
	}),
	schoolObservationCluster: L.divIcon({
        className: "div_icon",
		html: "<img src='assets/station_icon.png'><div class='cluster_pill'>more</div>",
		iconSize: [ 32, 32 ]
	})
};
wb.map.env = {
    aggregatorService: (location.pathname.indexOf("debug.html") !== -1 || location.port == 7777) ? "//localhost:7777/wb-aggregator" : "",
    momentDateFormat: "MM/DD/YYYY"
};

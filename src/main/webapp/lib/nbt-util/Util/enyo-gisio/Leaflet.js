enyo.kind({
	name: 'nbt.gisio.Leaflet',
	id: 'map',
	published: {
		map: null,
		useMapQuest: true,
		center: null,
		zoom: null,
		delayStart: false // lets you create the component without populating the map
	},
	events: {
		onReady: ''
	},
	kind: 'enyo.Control',
	rendered: function() {
		this.inherited(arguments);

		if (!this.delayStart) {
			this.initMap();
		}
	},

	initMap: function() {
		if (L.map && !this.map) {
			this.map = L.map('map');
		}

		if (this.useMapQuest) {
			L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", {
				subdomains: '1234',
				attribution: "<a target='_blank' href='http://www.nbtsolutions.com'>NBT Solutions</a>. Tiles Courtesy of <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>"
			}).addTo(this.map);
		}

		this.resetView();

		this.doReady({map: this.map});
	},

	resetView: function() {
		if (this.center && this.zoom) {
			this.map.setView(this.center, this.zoom);
		}
	}

});

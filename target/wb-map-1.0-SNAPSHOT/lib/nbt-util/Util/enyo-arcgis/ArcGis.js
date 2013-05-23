/**
 * General Enyo component for using ArcGIS services from an Enyo app.
 */
enyo.kind({
	id: 'map',
	name: 'nbt.ArcGis',
	kind: 'enyo.Control',
	events: {
		onReady: '',
	},
	published: {
		options: {},
		map: null,
		baseLayer: null
	},
	rendered: function() {
		this.inherited(arguments);

		// use CONUS as default extent if one not provided.
		this.options.extent = (this.options.extent) ? this.options.extent : new esri.geometry.Extent({"xmin":-15264000,"ymin":3948000,"xmax":-6331000,"ymax":5210000,"spatialReference":{"wkid":3857}});

		this.map = new esri.Map("map",this.options);

		// this will only fire if a baseLayer is set and gets added:
		var obj = this;
		dojo.connect(this.map, 'onLoad', function() {
			obj.doReady({map:this});
		});

		if (this.baseLayer) {
			this.map.addLayer(this.baseLayer); // this will fire the onLoad.
		} else {
			this.doReady({map: this.map}); // might not have everything in place that's there in onLoad.
		}
	}
});

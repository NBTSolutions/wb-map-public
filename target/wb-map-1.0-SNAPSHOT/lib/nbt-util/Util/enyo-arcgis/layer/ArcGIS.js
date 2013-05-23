enyo.kind({
	name: 'nbt.gisio.Layer.ArcGIS',
	kind: 'nbt.gisio.Layer',
	published: {
		infoTemplate: '' // set this as HTML with params to use in info windows.
	},
	addToMap: function() {
		this.map.addLayer(this.getObject());
	}

});

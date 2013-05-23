/**
 * Create an ArcGIS DynamicMapService layer. url is required.
 */
enyo.kind({
	name: 'nbt.gisio.Layer.ArcGIS.Feature',
	kind: 'nbt.gisio.Layer.ArcGIS',
	published: {
		url: null,
		queryLayer: 0,
		queryFields: ['*'],
		options: {
			outFields: ['*']
		}
	},
	/**
	 * Creates and retrieves the ArdGIS specific Layer object.
	 */
	getObject: function() {
		
		var defaults = {
			visible: true,
			mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
			id: this.name
		};

		dojo.mixin(defaults, this.options);

		var layer = new esri.layers.FeatureLayer(this.getUrl() + '/' + this.queryLayer, defaults);
		return layer;
	},
	getUrl: function() {
		if (!this.url) {
			this.error('missing required url');
		}
		return this.url;
	},
	/**
	 * Returns a QueryTask object based on this Layer.
	 */
	getQueryTask: function(queryLayer) {
		if (typeof(queryLayer) == 'undefined') {
			queryLayer = this.queryLayer; // allows default.
		}

		return new esri.tasks.QueryTask(this.getUrl() + '/' + queryLayer);
	}

});

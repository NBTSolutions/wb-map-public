/**
 * Create an ArcGIS DynamicMapService layer. url is required.
 */
enyo.kind({
	name: 'nbt.gisio.Layer.ArcGIS.Dynamic',
	kind: 'nbt.gisio.Layer.ArcGIS',
	published: {
		url: null,
		queryLayer: 0,
		queryFields: ['*'],
		format: 'png32'
	},
	/**
	 * Creates and retrieves the ArdGIS specific Layer object.
	 */
	getObject: function() {
		// I need visibility outside the main options, but this is how to send it in.
		// for some reason, ESRI won't let you set ALL the props in this options hash.
		this.options.visible = (typeof(this.visible) != 'undefined') ? this.visible : true;

		this.options.id = (typeof(this.options.id) != 'undefined') ? this.options.id : this.name;

		var layer = new esri.layers.ArcGISDynamicMapServiceLayer(this.getUrl(), this.options);
		layer.setImageFormat(this.format);
		return layer;
	},
	getUrl: function() {
		if (!this.url) {
			this.error('missing required url')
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

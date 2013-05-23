enyo.kind({
		name: 'nbt.OpenLayers',
		fit: true,
		options: null,
		kind: 'Control',
		proxy: window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/')+1) + 'simpleproxy.php?mode=native&url=',
		published: {
			map: null
		},
		statics: {
			SPHERICAL_MERCATOR: new OpenLayers.Projection('EPSG:3857'),
			GEOGRAPHIC: new OpenLayers.Projection('EPSG:4326')
		},
		events: {
			onReady: ""
		},
		components: [
			{ name: 'map', style: 'height: 100%' }
		],
		constructor: function(options) {
			this.inherited(arguments);
			this.options = options ? options : { };
		},
		create: function() {
			this.inherited(arguments);

			if (this.options && this.options.div !== undefined) {
				this.$.map.setId(this.options.div);
			}

			if (this.proxy) {
				OpenLayers.ProxyHost = this.proxy;
			}
		},
		rendered: function() {
			this.inherited(arguments);

			if (this.options && !this.options.div) {
				this.options.div = this.$.map.getId();
			}
			this.map = new OpenLayers.Map(this.options);
			this.doReady();
		}
});

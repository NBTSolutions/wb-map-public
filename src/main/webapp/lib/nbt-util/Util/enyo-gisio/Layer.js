/**
 * Generic component that describes a Layer object that can be added to a Map object.
 *
 * Since 'visible' is a published property, we get access to a 'visibleChanged' method
 * that we can override later if needed.
 * 'options' here is a map of layer-specific options, which are generally specific to
 * the kind of layer you're creating (OL layers will have different properties from
 * ArcGIS ones, and so on).
 */
enyo.kind({
	name: 'nbt.gisio.Layer',
	kind: 'Control',
	published: {
		visible: true,
		map: null,
		autoAdd: true,
		options: {},
		title: '',
		displayInSwitcher: true
	},
	mapChanged: function() {
		if (this.map && this.autoAdd) {
			this.addToMap();
		}
	},
	create: function() {
		this.inherited(arguments);

		if (this.map) {
			this.mapChanged();
		}

		// if we will be displayed in the layer switcher, set up the components now.
		if (this.displayInSwitcher) {
			this.setupComponents();
		}
	},
	setupComponents: function() {
		var chk = this.createComponent({
			kind: 'Checkbox',
			name: this.name + '_checkbox',
			checked: this.visible
		}, {owner: this});

		var lbl = this.createComponent({
			name: this.name + '_label',
			content: this.title
		}, {owner: this});
	},
	doVisibilityChange: function() {
		console.log('do viz');
	},
	/**
	 * rendering is only done if the Layer is meant to be included in a layer switcher.
	 */
	render: function() {
		console.log('render');
		if (!this.displayInSwitcher) {
			return;
		}

		this.inherited(arguments);
	},
	addToMap: function() {
		this.warn('should be implemented for your map + layer combination');
	},
	/**
	 * Implement this at the subclass level in order to retrieve your library's
	 * specific sort of layer object (esri.layers.X or OpenLayers.Layer.X, etc).
	 */
	getObject: function() {
		this.warn('implement on subclass');
	}
	
});

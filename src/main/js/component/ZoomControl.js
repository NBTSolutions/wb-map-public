enyo.kind({
    name: "wb.ZoomControl",
    kind: "FittableRows",
    classes: "leaflet-control-zoom leaflet-bar leaflet-control wb-zoom-control",
    published: {
        map: null
    },
    components: [
        {kind: "Image", src: "assets/zoom_in_icon.png", style: "cursor: pointer", ontap: "handleZoomIn"},
        {kind: "Image", src: "assets/zoom_out_icon.png", style: "cursor: pointer", ontap: "handleZoomOut"}
    ],
    handleZoomIn: function(inSender, inEvent) {
        this.map.zoomIn();
    },
    handleZoomOut: function(inSender, inEvent) {
        this.map.zoomOut();
    }
});


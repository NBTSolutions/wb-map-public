enyo.kind({
    name: "wb.ObservationInfoWindow",
    kind: "FittableRows",
    classes: "observation-info-window",
    published: {
        observation: null
    },
    components: [
        {kind: "enyo.Signals", onObservationResponse: "handleObservationResponse"},
        {kind: "FittableColumns", classes: "header", components: [
            {kind: "Image", name: "userAvatar", classes: "avatar"},
            {kind: "FittableRows", fit: true, components: [
                {name: "username"},
                {name: "investigationTitle"},
                {controlClasses: "enyo-inline", components: [
                    {content: "Recorded Date: ", classes: "phenomenon"}, {name: "recordedDate", style: "margin-right: 1em"},
                    {content: "Location: ", classes: "phenomenon"}, {name: "location"}
                ]}
            ]}
        ]},
        {classes: "thumbnailContainer", controlClasses: "enyo-inline", components: [
            {tag: "i", name: "imageThumbnailPlaceholder", classes: "icon-camera placeholder"},
            {tag: "i", name: "videoThumbnailPlaceholder", classes: "icon-facetime-video placeholder"},
            {kind: "onyx.TooltipDecorator", components: [
                {kind: "ImageView", name: "imageThumbnail", classes: "thumbnail image", scale: "height", ontap: "doThumbnailTap"},
                {kind: "onyx.Tooltip", name: "imageThumbnailTooltip", content: "No image available for this observation."}
            ]},
            {kind: "onyx.TooltipDecorator", components: [
                {kind: "ImageView", name: "videoThumbnail", classes: "thumbnail video", scale: "height", ontap: "doThumbnailTap"},
                {kind: "onyx.Tooltip", name: "videoThumbnailTooltip", content: "No video available for this observation."}
            ]}
        ]},
        {controlClasses: "enyo-inline", classes: "measurements-header", components: [
            {tag: "h3", content: "Measurements"},
            {content: "(Scroll for more)", classes: "subtitle"}
        ]},
        {kind: "Scroller", classes: "measurements-container", touch: true, components: [
            {kind: "Repeater", onSetupItem: "setupMeasurementItem", components: [
                {controlClasses: "enyo-inline", classes: "list-item", components: [
                    {name: "phenomenon", classes: "phenomenon"},
                    {name: "value", classes: "value"}
                ]}
            ]}
        ]}
    ],
    doThumbnailTap: function(inSender, inEvent) {
        // TODO implement
    },
    setupMeasurementItem: function(inSender, inEvent) {
        var measurement = this.observation.measurements[inEvent.index];

        inEvent.item.$.value.setContent(measurement.value + " " + measurement.phenomenon.unit.name);
        inEvent.item.$.phenomenon.setContent(measurement.phenomenon.name);
    },
    handleObservationResponse: function(inSender, inEvent) {
        if (this.observation.properties.id !== inEvent.observation.id) return;

        _.extend(this.observation, inEvent.observation);

        var measurements = this.observation.measurements;

        this.$.recordedDate.setContent(wb.Util.prettifyDate(this.observation.timestamp));
        this.$.location.setContent("("+ this.observation.location.lng.toFixed(5) + ", " + this.observation.location.lat.toFixed(5) + ")");
        this.$.repeater.setCount(measurements.length);

        _.each(_.filter(measurements, function(m) { return _.contains(["image", "video"], m.phenomenon.name); }), function(measurement) {
            var phenom = measurement.phenomenon.name;
            var meta = JSON.parse(measurement.meta) || { };
            this.$[phenom + "ThumbnailPlaceholder"].setShowing(false);
            this.$[phenom + "Thumbnail"].setSrc(meta.thumbnailUrl || meta.url);
            this.$[phenom + "ThumbnailTooltip"].setContent(meta.caption || "No caption provided.");
        }, this);
        this.$.investigationTitle.setContent("Default Weatherblur Investigation");
        this.$.userAvatar.setSrc("assets/foss4glogo.png");
        this.$.username.setContent("FOSS4G Demo User");
    }
});

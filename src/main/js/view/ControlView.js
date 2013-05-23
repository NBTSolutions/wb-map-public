enyo.kind({
    name: "wb.ControlView",
    kind: "enyo.Slideable",
    classes : "layer-control",
    max: 100,
    value: 0, 
    unit: "%",
    overMoving: false,
    components: [
		{name: "shadow", classes: "pullout-shadow"},
		{kind: "onyx.Grabber", classes: "pullout-grabbutton", ontap: "onGrabberTap"},
        {kind: "Scroller", touch: true, classes: "enyo-fit", components: [
            {kind: "wb.TitledDrawer", title: "Data Sources", titleClasses: "heading", drawerComponents: [
                {name: "baseGroup", classes: "sub-content", components: [
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "studentObservationSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"toggleObservation"},
                        {name: "userObservationLayerLegend", kind: "Image", classes: "mapLegend", src: "assets/user_legend_icon.png"},
                        {content: "User Observations"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {kind: "onyx.Checkbox", name: "schoolLayerSelect", classes: "filter-checkbox", checked: true, onchange: "toggleSchool"},
                        {name: "schoolLayerLegend", kind: "Image", classes: "mapLegend", src: "assets/station_legend_icon.png"},
                        {content: "School Weather Stations"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "buoyLayerSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"toggleBuoy"},
                        {name: "buoyLayerLegend", kind: "Image", classes: "mapLegend", src: "assets/buoy_legend_icon.png"},
                        {content: "Buoys"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "radarLayerSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"toggleRadar"},
                        {name: "radarLayerLegend", kind: "Image", classes: "mapLegend", src: "assets/radar_legend_icon.png"},
                        {content: "NOAA Radar"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "tempLayerSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"toggleSeaTemp"},
                        {name: "tempLayerLegend", kind: "Image", classes: "mapLegend", src: "assets/sea_temp_legend_icon.png"},
                        {content: "NOAA Surface Temps"}
                    ]}
                ]}
            ]},
            {kind: "wb.TitledDrawer", title: "User Observations", titleClasses: "heading", drawerComponents: [
                {name: "userGroup", classes: "sub-content", components: [
                    {content: "Filter by Type:", classes: "sub-heading"},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "photoTypeSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"checkboxChanged"},
                        {content: "Photo"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "videoTypeSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"checkboxChanged"},
                        {content: "Video"}
                    ]},
                    {content: "Measurements:", classes: "sub-heading"},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "windSpeedSelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"checkboxChanged"},
                        {content: "wind speed"}
                    ]},
                    {controlClasses: "enyo-inline", classes: "filter", components: [
                        {name: "visibilitySelect", kind: "onyx.Checkbox", classes: "filter-checkbox", checked: true, onchange:"checkboxChanged"},
                        {content: "visibility"}
                    ]}
                    /* we will most likely put this back in to the final version
                    {content: "Filter by Observer: ", classes: "sub-heading"},
                    {controlClasses: "enyo-inline", components: [
                        {name: "fishingObserverSelect", kind: "onyx.Checkbox", checked: true, onchange:"checkboxChanged"},
                        {content: "Fishing Vessel"}
                    ]},
                    {controlClasses: "enyo-inline", components: [
                        {name: "studentObserverSelect", kind: "onyx.Checkbox", checked: true, onchange:""},
                        {content: "Student"}
                    ]}
                    */
                ]}
            ]},
            {kind: "wb.TitledDrawer", title: "Date Filter", titleClasses: "heading", classes: "date", drawerComponents: [
                {controlClasses: "enyo-inline", classes: "filter", components: [
                    {content: "From: ", classes: "left-column"},
                    {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                        {kind: "onyx.Input", name: "fromDate", classes: "", placeholder: "MM/DD/YY", onValueChanged: "doValidateDateFields"}
                    ]},
                    {kind: "onyx.Button", classes: "icon-calendar", ontap: "doShowCalendar", field: "fromDate"}
                ]},
                {controlClasses: "enyo-inline", classes: "filter", components: [
                    {content: "To: ", classes: "left-column"},
                    {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                        {kind: "onyx.Input", name: "toDate", classes: "", placeholder: "MM/DD/YY", onValueChanged: "doValidateDateFields"}
                    ]},
                    {kind: "onyx.Button", classes: "icon-calendar", ontap: "doShowCalendar", field: "toDate"}
                ]},
                {kind: "onyx.Button", content: "Today", classes: "button", ontap: "doDateRangeOptionTap"},
                {kind: "onyx.Button", content: "Past Week", ontap: "doDateRangeOptionTap"},
                {kind: "onyx.Button", content: "Past Month", ontap: "doDateRangeOptionTap"}
            ]}
        ]}
    ],
    doValidateDateFields: function(inSender, inEvent) {
        var a = this.$.fromDate.getValue();
        var b = this.$.toDate.getValue();
        if (!(a && b)) return;

        if (moment(b).isBefore(moment(a))) {
            // TODO convert to wb.Popup
            alert("Your end date must not occur before your start date");
            inSender.setValue(null);
        }
    },
    doShowCalendar: function(inSender, inEvent) {
        new wb.DatePickCalendar({ field: this.$[inSender.field] }).show();
    },
    doDateRangeOptionTap: function(inSender, inEvent) {
        var fromDate = moment();
        if (inSender.getContent() == "Past Week") {
            fromDate = fromDate.subtract('weeks', 1);
        }
        else if (inSender.getContent() == "Past Month") {
            fromDate = fromDate.subtract('months', 1);
        }
        this.$.fromDate.setValue(fromDate.format(wb.map.env.momentDateFormat));
        this.$.toDate.setValue(moment().format(wb.map.env.momentDateFormat));
    },
    onGrabberTap: function(inSender, inEvent) {
        this.toggleMinMax();
        //enyo.Signals.send("onMapGrowlReposition", { top: 10px, right: this.$.grabber.
    },
    toggleSchool : function(inSender, inEvent) { 
        enyo.Signals.send("onToggleSchool", { selected: inSender.getValue() });
    },
    toggleBuoy : function(inSender, inEvent) {
        enyo.Signals.send("onToggleBuoy", { selected: inSender.getValue() });
    },
    toggleObservation : function(inSender, inEvent) {
        enyo.Signals.send("onToggleObservation", { selected: inSender.getValue() }); 
    },
    toggleRadar : function(inSender, inEvent) {
        enyo.Signals.send("onToggleRadar", { selected: inSender.getValue() });
    },
    toggleSeaTemp : function(inSender, inEvent) {
        enyo.Signals.send("onToggleSeaTemp", { selected: inSender.getValue() });
    }
});

enyo.kind({
    name: "CalendarInputs",
    classes: "control-sub-content ", 
    events: {
        onPickDate: ''
    },
    components: [
        {controlClasses: "enyo-inline", components: [
            {content: "From: "},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input", name: "fromDate", classes: "", placeholder: "MM/DD/YY"}
            ]},
            {kind: "onyx.Icon", src: "assets/calendar.png", ontap: "pickFromDate"}
        ]},
        {controlClasses: "enyo-inline", components: [
            {content: "To: "},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input", name: "toDate", classes: "", placeholder: "MM/DD/YY"}
            ]},
            {kind: "onyx.Icon", src: "assets/calendar.png", ontap: "doShowCalendar"}
        ]},
    ],
    doShowCalendar: function(inSender, inEvent) {
        console.log("calendar tapped");
        //new wb.DatePickCalendar({ inputField: }).show();
        //this.doPickDate({ activeInput : this.$.fromDate, isFromDate: true });
    },
    pickToDate: function(inSender, inEvent) {
        console.log("calendar tapped");
        this.doPickDate({ activeInput : this.$.toDate, isFromDate: false });
    },
});

enyo.kind({
    kind: "onyx.Popup",
    name: "wb.DatePickCalendar",
    centered: true, 
    floating: true,
    scrim: true,
    autoDismiss: false,
    modal: true,
    classes: "calendar-popup",
    components: [
        {name: "header", components: [
            {tag: "i", classes: "icon-circle-arrow-left", ontap: "prevMonth"},
            {kind: "onyx.DatePicker", onSelect: "doPickerChanged"},
            {tag: "i", classes: "icon-circle-arrow-right", ontap: "nextMonth"}
        ]},
        {kind: "CalendarSelector", onDaySet: "doCalendarChanged"},
        {kind: "onyx.Button", content: " Cancel", classes: "icon-remove", ontap: "hide"},
        {kind: "onyx.Button", content: " Done", classes: "icon-ok", ontap: "doSaveAndHide"}
    ],
    create: function() {
        this.inherited(arguments);
        if (!this.field) throw "wb.DatePickCalendar requires a 'field' property.";
    },
    doCalendarChanged: function(inSender, inEvent) {
        var curDate = moment(inSender.getValue());
        var selectedDate = moment(inEvent.control.getValue());
        if (!curDate.isSame(selectedDate, "day")) return;

        _.each(inSender.getDays(), function(dayElem) {
            dayElem.addRemoveClass("day-selected", false);
        }, this);
        inEvent.control.addRemoveClass("day-selected", true);
        this.$.datePicker.setValue(curDate.toDate());
    },
    doPickerChanged: function(inSender, inEvent){
        this.$.calendarSelector.setValue(inEvent.value);
    },
    nextMonth: function() {
        this.$.calendarSelector.nextMonth();
    },
    prevMonth: function(){
        this.$.calendarSelector.prevMonth();
    },
    doSaveAndHide: function() {
        this.field.setValue(moment(this.$.datePicker.getValue()).format(wb.map.env.momentDateFormat));
        this.field.bubble("onValueChanged");
        this.hide();
    }
});

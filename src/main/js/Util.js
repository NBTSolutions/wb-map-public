enyo.kind({
    name: "wb.Util",
    statics: {
        prettifyDate: function(uglyDateString) {
            return moment(uglyDateString).format("MMMM Do YYYY, h:mm a");
        }
    }
});

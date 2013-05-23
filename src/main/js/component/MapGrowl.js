enyo.kind({
    kind: "enyo.Popup",
    name: "nbt.MapGrowl",
    published: {
        data: null
    },
    components: [
        {kind: "enyo.Signals", onMapGrowlReposition: "doReposition"},
        {name: "growl"}
    ],
    dataChanged: function(oldValue) {
        console.log(this.data);
        this.$.growl.setContent(this.data);
    },
    doReposition: function(inSender, inEvent) {
        this.showAtPosition({ top: inEvent.top, right: inEvent.right });
    }
});

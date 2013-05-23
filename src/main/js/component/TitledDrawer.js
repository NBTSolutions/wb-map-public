enyo.kind({
    name: "wb.TitledDrawer",
    classes: "titled-drawer",
    style: "width: 100%",
    components: [
        {controlClasses: "enyo-inline", name: "container", ontap: "doDrawerToggle", components: [
            {tag: "i", name: "icon", classes: "icon-collapse-alt"},
            {classes: "text", name: "title"}
        ]},
        {kind: "onyx.Drawer"}
    ],
    create: function() {
        this.inherited(arguments);
        this.$.container.setClasses(this.titleClasses);
        this.$.title.setContent(this.title);
        this.$.drawer.createComponents(this.drawerComponents, { owner: this.owner });
    },
    doDrawerToggle: function(inSender, inEvent) {
        var isOpen = this.$.drawer.open;
        this.$.drawer.setOpen(!isOpen);
        this.$.icon.addRemoveClass("icon-collapse-alt", !isOpen);
        this.$.icon.addRemoveClass("icon-expand-alt", isOpen);
    }
});

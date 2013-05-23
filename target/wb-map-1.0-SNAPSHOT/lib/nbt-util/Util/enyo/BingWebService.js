/**
 * XXX it'd be awesome to use underscore for the object extensions in
 * fireSuccessEvent and fireFailureEvent, but the compiler won't allow this
 * because it doesn't know what "_" is.
 */
enyo.kind({
    name: "nbt.BingWebService",
    geocodeUrl: "https://dev.virtualearth.net/REST/v1/Locations",
    published: {
        key: null
    },
    events: {
        onSuccess: "",
        onFailure: ""
    },
    geocode: function(query, argv) {
        var jsonp = new enyo.JsonpRequest({
			argv: argv ? argv : { },
            url: this.geocodeUrl + "?key=" + this.key,
            callbackName: "jsonp"
        });
        jsonp.go({ q: query });
        jsonp.response(this, "fireSuccessEvent");
        jsonp.error(this, "fireFailureEvent");
    },
    fireSuccessEvent: function(inSender, inEvent) {
		for (var k in inSender.argv) inEvent[k] = inSender.argv[k];
        this.doSuccess(inEvent);
    },
    fireFailureEvent: function(inSender, inEvent) {
		for (var k in inSender.argv) inEvent[k] = inSender.argv[k];
        this.doFailure(inEvent);
    }
});


// minifier: path aliases

enyo.path.addPaths({js: "../js/"});

// BingWebService.js

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
geocode: function(e, t) {
var n = new enyo.JsonpRequest({
argv: t ? t : {},
url: this.geocodeUrl + "?key=" + this.key,
callbackName: "jsonp"
});
n.go({
q: e
}), n.response(this, "fireSuccessEvent"), n.error(this, "fireFailureEvent");
},
fireSuccessEvent: function(e, t) {
for (var n in e.argv) t[n] = e.argv[n];
this.doSuccess(t);
},
fireFailureEvent: function(e, t) {
for (var n in e.argv) t[n] = e.argv[n];
this.doFailure(t);
}
});

// Util.js

String.prototype.format || (String.prototype.format = function() {
var e = arguments;
return this.replace(/{(\d+)}/g, function(t, n) {
return typeof e[n] != "undefined" ? e[n] : t;
});
}), enyo.kind({
name: "nbt.Util",
statics: {
isScrollbarRendered: function(e) {
return e.scrollHeight > e.clientHeight;
},
getScrollbarWidth: function() {
var e = document.createElement("p");
e.style.width = "100%", e.style.height = "200px";
var t = document.createElement("div");
t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.visibility = "hidden", t.style.width = "200px", t.style.height = "150px", t.style.overflow = "hidden", t.appendChild(e), document.body.appendChild(t);
var n = e.offsetWidth;
t.style.overflow = "scroll";
var r = e.offsetWidth;
return n == r && (r = t.clientWidth), document.body.removeChild(t), n - r;
},
zeroFill: function(e, t) {
return t -= e.toString().length, t > 0 ? (new Array(t + (/\./.test(e) ? 2 : 1))).join("0") + e : e + "";
}
}
});

// nbt-util/Util/generic/Util.js

var nbt = nbt || {};

nbt.generic = nbt.generic || {}, nbt.generic.Util = {
isSafariLionOrNewer: function(e) {
if (e.indexOf("AppleWebKit") == -1) return !1;
var t = parseInt(/X (\d{2})/.exec(e)[1]), n = parseInt(/\d{2}_(\d{1,2})/.exec(e)[1]);
return t >= 10 && n >= 7;
},
isPhoneGap: function() {
return (window.cordova || window.PhoneGap || window.phonegap) && /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}
};

// nbt-util/Util/geo/Util.js

var nbt = nbt || {};

nbt.geo = nbt.geo || {}, nbt.geo.Util = {
distVincenty: function(e, t, n, r) {
var i = 6378137, s = 6356752.314245, o = 1 / 298.257223563, u = (r - t).toRad(), a = Math.atan((1 - o) * Math.tan(e.toRad())), f = Math.atan((1 - o) * Math.tan(n.toRad())), l = Math.sin(a), c = Math.cos(a), h = Math.sin(f), p = Math.cos(f), d = u, v, m = 100;
do {
var g = Math.sin(d), y = Math.cos(d), b = Math.sqrt(p * g * p * g + (c * h - l * p * y) * (c * h - l * p * y));
if (b == 0) return 0;
var w = l * h + c * p * y, E = Math.atan2(b, w), S = c * p * g / b, x = 1 - S * S, T = w - 2 * l * h / x;
isNaN(T) && (T = 0);
var N = o / 16 * x * (4 + o * (4 - 3 * x));
v = d, d = u + (1 - N) * o * S * (E + N * b * (T + N * w * (-1 + 2 * T * T)));
} while (Math.abs(d - v) > 1e-12 && --m > 0);
if (m == 0) return NaN;
var C = x * (i * i - s * s) / (s * s), k = 1 + C / 16384 * (4096 + C * (-768 + C * (320 - 175 * C))), L = C / 1024 * (256 + C * (-128 + C * (74 - 47 * C))), A = L * b * (T + L / 4 * (w * (-1 + 2 * T * T) - L / 6 * T * (-3 + 4 * b * b) * (-3 + 4 * T * T))), O = s * k * (E - A);
O = O.toFixed(3);
return O;
var M, _;
}
}, typeof Number.prototype.toRad == "undefined" && (Number.prototype.toRad = function() {
return this * Math.PI / 180;
});

// nbt-util/Util/geo/leaflet.js

var nbt = nbt || {};

nbt.geo = nbt.geo || {}, nbt.geo.leaflet = {
getNbtAttribution: function(e, t) {
return new L.Control.Attribution({
position: e || "bottomright",
prefix: "<span style='font-size: 12px'>Powered by <a target='_blank' href='http://www.nbtsolutions.com' style='color: " + (t || "#0078A8") + "'><i class='icon-map-marker'></i> NBT Solutions</a></span>"
});
},
getNbtAttributionBasic: function(e, t) {
return new L.Control.Attribution({
position: e || "bottomright",
prefix: "<span style='font-size: 12px'>Powered by <a target='_blank' href='http://www.nbtsolutions.com' style='color: " + (t || "#0078A8") + "'>NBT Solutions</a></span>"
});
},
getMapquestTileLayer: function() {
return L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", {
subdomains: "1234",
attribution: "Tiles: <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>"
});
},
getArcGISTileLayer: function(e) {
return L.tileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/" + e + "/MapServer/tile/{z}/{y}/{x}", {
attribution: "Tiles: &copy; Esri"
});
}
};

// CalendarSelector.js

enyo.kind({
name: "CalendarSelector",
classes: "enyo-unselectable",
published: {
dayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
value: new Date,
dayColorDefault: "LightSlateGray",
dayColorSelected: "Gold",
dayColorToday: "GoldenRod",
dayColorOtherMonth: "Silver",
numberColorThisMonth: "#202020",
numberColorOtherMonth: "dimgrey"
},
events: {
onSelect: "",
onDaySet: ""
},
components: [ {
name: "day_names",
classes: "top-day-box"
}, {
fit: !0,
name: "calVBox",
kind: "CalMonth",
style: "height: auto;"
} ],
create: function() {
this.inherited(arguments);
for (var e = 0; e < 7; e++) this.$.day_names.createComponent({
content: this.dayNames[e]
});
},
rendered: function() {
this.inherited(arguments), this.updateCalendar();
},
updateCalendar: function() {
this.dayArray = [], this.getDays(), this.fillData();
},
fillData: function() {
var e = this.$.calVBox.getControls(), t = 0;
for (var n = 0; n < e.length; n++) {
var r = e[n].getControls();
for (var i = 0; i < r.length; i++) {
r[i].setValue(this.dayArray[t]), r[i].setClassAttribute("");
var s = this.getRelativeClass(this.dayArray[t]);
r[i].addClass(s), t++, this.doDaySet({
control: r[i]
});
}
}
},
getRelativeClass: function(e) {
if (e.getMonth() < this.value.getMonth()) return "prev-month";
if (e.getMonth() > this.value.getMonth()) return "next-month";
var t = new Date;
return t.getFullYear() == e.getFullYear() && t.getDate() == e.getDate() && t.getMonth() == e.getMonth() ? "today" : "day";
},
getColors: function(e) {
var t = this.dayColorDefault, n = this.numberColorThisMonth, r = (new Date).getDate(), i = (new Date).getMonth(), s = (new Date).getFullYear();
return e.getMonth() != this.value.getMonth() ? (t = this.dayColorOtherMonth, n = this.numberColorOtherMonth) : this.value.getFullYear() == e.getFullYear() && this.value.getDate() == e.getDate() && this.value.getMonth() == e.getMonth() ? t = this.dayColorSelected : s == e.getFullYear() && r == e.getDate() && i == e.getMonth() && (t = this.dayColorToday), [ t, n ];
},
getDays: function() {
var e = new Date(this.value);
e.setDate(1);
var t = e.getDay(), n = new Date(e);
n.setDate(0);
var r = n.getDate(), s = new Date(e);
s.setMonth(e.getMonth() + 1), s.setDate(0);
var o = s.getDate(), u = r - t + 1;
for (i = 0; i < t; i++) this.dayArray.push(new Date(n.getFullYear(), n.getMonth(), u, 12, 0, 0)), u++;
u = 1;
while (u <= o) this.dayArray.push(new Date(s.getFullYear(), s.getMonth(), u, 12, 0, 0)), u++;
u = 1, s.setDate(s.getDate() + 1);
while (this.dayArray.length < 42) this.dayArray.push(new Date(s.getFullYear(), s.getMonth(), u, 12, 0, 0)), u++;
},
calTap: function(e) {
this.value = e.value, this.updateCalendar(), this.doSelect({
value: this.value
});
},
setValue: function(e) {
this.value = new Date(e), this.updateCalendar();
},
nextMonth: function() {
var e = this.value.getDate();
this.value.setMonth(this.value.getMonth() + 1), e != this.value.getDate() && this.value.setDate(0), this.updateCalendar(), this.doSelect({
value: this.value
});
},
prevMonth: function() {
var e = this.value.getDate();
this.value.setMonth(this.value.getMonth() - 1), e != this.value.getDate() && this.value.setDate(0), this.updateCalendar(), this.doSelect({
value: this.value
});
}
}), enyo.kind({
name: "CalDay",
classes: "day-container",
published: {
value: {}
},
events: {
onDayPicked: ""
},
handlers: {
ontap: "tapMe"
},
valueChanged: function(e, t) {
this.setContent(this.value.getDate());
},
setValue: function(e) {
this.value = e, this.valueChanged();
},
tapMe: function(e, t) {
return this.owner.owner.owner.calTap({
value: this.value
}), this.doDayPicked({
day: this
}), !0;
}
}), enyo.kind({
name: "CalWeek",
classes: "onyx-toolbar-inline week-container",
defaultKind: "CalDay",
components: [ {}, {}, {}, {}, {}, {}, {} ]
}), enyo.kind({
name: "CalMonth",
defaultKind: "CalWeek",
components: [ {}, {}, {}, {}, {}, {} ]
});

// DatePicker.js

enyo.kind({
name: "DatePicker",
published: {
value: new Date,
minYear: 2012,
maxYear: 2020
},
events: {
onSelect: ""
},
components: [ {
name: "topBar"
} ],
rendered: function() {
this.createTopBar(), this.updateStuff(), this.inherited(arguments);
},
valueChanged: function() {
this.render();
},
createTopBar: function() {
var e = [];
this.years = [];
for (var t = this.minYear; t <= this.maxYear; t++) this.years.push(t), e.push({
content: t,
value: t - this.minYear
});
this.getDays();
var n = [];
for (t = 0; t < this.days.length; t++) n.push({
content: t + 1,
value: t + 1
});
var r = [ {
content: "January",
value: 0
}, {
content: "February",
value: 1
}, {
content: "March",
value: 2
}, {
content: "April",
value: 3
}, {
content: "May",
value: 4
}, {
content: "June",
value: 5
}, {
content: "July",
value: 6
}, {
content: "August",
value: 7
}, {
content: "September",
value: 8
}, {
content: "October",
value: 9
}, {
content: "November",
value: 10
}, {
content: "December",
value: 11
} ], i = [ {
kind: "Select",
name: "monthSel",
onchange: "monthChanged",
components: r
}, {
kind: "Select",
name: "daySel",
onchange: "dayChanged",
components: n
}, {
kind: "Select",
name: "yearSel",
onchange: "yearChanged",
components: e
} ];
this.$.topBar.destroyClientControls(), this.$.topBar.createComponents(i, {
owner: this
}), this.$.topBar.render();
},
setValue: function(e) {
this.value = e, this.valueChanged();
},
getValue: function() {
return this.value;
},
dayChanged: function(e) {
return this.value.setDate(e.selected + 1), this.doSelect({
value: new Date(this.value)
}), !0;
},
monthChanged: function(e) {
return this.value.setMonth(e.selected), this.updateDays(), this.doSelect({
value: new Date(this.value)
}), !0;
},
yearChanged: function(e) {
return this.value.setFullYear(this.years[e.selected]), this.updateDays(), this.doSelect({
value: new Date(this.value)
}), !0;
},
updateStuff: function() {
this.$.monthSel.setSelected(this.value.getMonth()), this.$.yearSel.setSelected(this.value.getFullYear() - this.minYear), this.$.daySel.setSelected(this.value.getDate() - 1), this.updateDays();
},
updateDays: function() {
this.getDays();
var e = [];
for (var t = 0; t < this.days.length; t++) e.push({
content: t + 1,
value: t + 1
});
this.$.daySel.destroyClientControls(), this.$.daySel.createComponents(e, {
owner: this
}), this.$.daySel.render();
},
getDays: function() {
this.days = [];
var e = new Date(this.value);
e.setDate(1);
var t = new Date(e);
t.setMonth(e.getMonth() + 1), t.setDate(0);
var n = t.getDate(), r = 1;
while (r <= n) this.days.push(r), r++;
}
});

// markercluster/dist/leaflet.markercluster-src.js

(function() {
L.MarkerClusterGroup = L.FeatureGroup.extend({
options: {
maxClusterRadius: 80,
iconCreateFunction: null,
spiderfyOnMaxZoom: !0,
showCoverageOnHover: !0,
zoomToBoundsOnClick: !0,
singleMarkerMode: !1,
disableClusteringAtZoom: null,
removeOutsideVisibleBounds: !0,
animateAddingMarkers: !1,
spiderfyDistanceMultiplier: 1,
polygonOptions: {}
},
initialize: function(e) {
L.Util.setOptions(this, e), this.options.iconCreateFunction || (this.options.iconCreateFunction = this._defaultIconCreateFunction), L.FeatureGroup.prototype.initialize.call(this, []), this._inZoomAnimation = 0, this._needsClustering = [], this._needsRemoving = [], this._currentShownBounds = null;
},
addLayer: function(e) {
if (e instanceof L.LayerGroup) {
var t = [];
for (var n in e._layers) t.push(e._layers[n]);
return this.addLayers(t);
}
if (!this._map) return this._needsClustering.push(e), this;
if (this.hasLayer(e)) return this;
this._unspiderfy && this._unspiderfy(), this._addLayer(e, this._maxZoom);
var r = e, i = this._map.getZoom();
if (e.__parent) while (r.__parent._zoom >= i) r = r.__parent;
return this._currentShownBounds.contains(r.getLatLng()) && (this.options.animateAddingMarkers ? this._animationAddLayer(e, r) : this._animationAddLayerNonAnimated(e, r)), this;
},
removeLayer: function(e) {
return this._map ? e.__parent ? (this._unspiderfy && (this._unspiderfy(), this._unspiderfyLayer(e)), this._removeLayer(e, !0), e._icon && (L.FeatureGroup.prototype.removeLayer.call(this, e), e.setOpacity(1)), this) : this : (!this._arraySplice(this._needsClustering, e) && this.hasLayer(e) && this._needsRemoving.push(e), this);
},
addLayers: function(e) {
var t, n, r;
if (!this._map) return this._needsClustering = this._needsClustering.concat(e), this;
for (t = 0, n = e.length; t < n; t++) {
r = e[t];
if (this.hasLayer(r)) continue;
this._addLayer(r, this._maxZoom);
if (r.__parent && r.__parent.getChildCount() === 2) {
var i = r.__parent.getAllChildMarkers(), s = i[0] === r ? i[1] : i[0];
L.FeatureGroup.prototype.removeLayer.call(this, s);
}
}
for (t in this._layers) r = this._layers[t], r instanceof L.MarkerCluster && r._iconNeedsUpdate && r._updateIcon();
return this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds), this;
},
removeLayers: function(e) {
var t, n, r;
if (!this._map) {
for (t = 0, n = e.length; t < n; t++) this._arraySplice(this._needsClustering, e[t]);
return this;
}
for (t = 0, n = e.length; t < n; t++) {
r = e[t];
if (!r.__parent) continue;
this._removeLayer(r, !0, !0), r._icon && (L.FeatureGroup.prototype.removeLayer.call(this, r), r.setOpacity(1));
}
this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);
for (t in this._layers) r = this._layers[t], r instanceof L.MarkerCluster && r._updateIcon();
return this;
},
clearLayers: function() {
this._map || (this._needsClustering = [], delete this._gridClusters, delete this._gridUnclustered), this._noanimationUnspiderfy && this._noanimationUnspiderfy();
for (var e in this._layers) L.FeatureGroup.prototype.removeLayer.call(this, this._layers[e]);
return this.eachLayer(function(e) {
delete e.__parent;
}), this._map && this._generateInitialClusters(), this;
},
getBounds: function() {
var e = new L.LatLngBounds;
if (this._topClusterLevel) e.extend(this._topClusterLevel._bounds); else for (var t = this._needsClustering.length - 1; t >= 0; t--) e.extend(this._needsClustering[t].getLatLng());
return e;
},
eachLayer: function(e, t) {
var n = this._needsClustering.slice(), r;
this._topClusterLevel && this._topClusterLevel.getAllChildMarkers(n);
for (r = n.length - 1; r >= 0; r--) e.call(t, n[r]);
},
hasLayer: function(e) {
if (e._noHas) return !1;
var t, n = this._needsClustering;
for (t = n.length - 1; t >= 0; t--) if (n[t] === e) return !0;
n = this._needsRemoving;
for (t = n.length - 1; t >= 0; t--) if (n[t] === e) return !1;
return !!e.__parent && e.__parent._group === this;
},
zoomToShowLayer: function(e, t) {
var n = function() {
if ((e._icon || e.__parent._icon) && !this._inZoomAnimation) {
this._map.off("moveend", n, this), this.off("animationend", n, this);
if (e._icon) t(); else if (e.__parent._icon) {
var r = function() {
this.off("spiderfied", r, this), t();
};
this.on("spiderfied", r, this), e.__parent.spiderfy();
}
}
};
e._icon ? t() : e.__parent._zoom < this._map.getZoom() ? (this._map.on("moveend", n, this), e._icon || this._map.panTo(e.getLatLng())) : (this._map.on("moveend", n, this), this.on("animationend", n, this), this._map.setView(e.getLatLng(), e.__parent._zoom + 1), e.__parent.zoomToBounds());
},
onAdd: function(e) {
this._map = e;
var t, n, r;
this._gridClusters || this._generateInitialClusters();
for (t = 0, n = this._needsRemoving.length; t < n; t++) r = this._needsRemoving[t], this._removeLayer(r);
this._needsRemoving = [];
for (t = 0, n = this._needsClustering.length; t < n; t++) {
r = this._needsClustering[t];
if (r.__parent) continue;
this._addLayer(r, this._maxZoom);
}
this._needsClustering = [], this._map.on("zoomend", this._zoomEnd, this), this._map.on("moveend", this._moveEnd, this), this._spiderfierOnAdd && this._spiderfierOnAdd(), this._bindEvents(), this._zoom = this._map.getZoom(), this._currentShownBounds = this._getExpandedVisibleBounds(), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);
},
onRemove: function(e) {
e.off("zoomend", this._zoomEnd, this), e.off("moveend", this._moveEnd, this), this._unbindEvents(), this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", ""), this._spiderfierOnRemove && this._spiderfierOnRemove();
for (var t in this._layers) L.FeatureGroup.prototype.removeLayer.call(this, this._layers[t]);
this._map = null;
},
_arraySplice: function(e, t) {
for (var n = e.length - 1; n >= 0; n--) if (e[n] === t) return e.splice(n, 1), !0;
},
_removeLayer: function(e, t, n) {
var r = this._gridClusters, i = this._gridUnclustered, s = this._map;
if (t) for (var o = this._maxZoom; o >= 0; o--) if (!i[o].removeObject(e, s.project(e.getLatLng(), o))) break;
var u = e.__parent, a = u._markers, f;
this._arraySplice(a, e);
while (u) {
u._childCount--;
if (u._zoom < 0) break;
t && u._childCount <= 1 ? (f = u._markers[0] === e ? u._markers[1] : u._markers[0], r[u._zoom].removeObject(u, s.project(u._cLatLng, u._zoom)), i[u._zoom].addObject(f, s.project(f.getLatLng(), u._zoom)), this._arraySplice(u.__parent._childClusters, u), u.__parent._markers.push(f), f.__parent = u.__parent, u._icon && (L.FeatureGroup.prototype.removeLayer.call(this, u), n || L.FeatureGroup.prototype.addLayer.call(this, f))) : (u._recalculateBounds(), (!n || !u._icon) && u._updateIcon()), u = u.__parent;
}
delete e.__parent;
},
_propagateEvent: function(e) {
e.target instanceof L.MarkerCluster && (e.type = "cluster" + e.type), L.FeatureGroup.prototype._propagateEvent.call(this, e);
},
_defaultIconCreateFunction: function(e) {
var t = e.getChildCount(), n = " marker-cluster-";
return t < 10 ? n += "small" : t < 100 ? n += "medium" : n += "large", new L.DivIcon({
html: "<div><span>" + t + "</span></div>",
className: "marker-cluster" + n,
iconSize: new L.Point(40, 40)
});
},
_bindEvents: function() {
var e = null, t = this._map, n = this.options.spiderfyOnMaxZoom, r = this.options.showCoverageOnHover, i = this.options.zoomToBoundsOnClick;
(n || i) && this.on("clusterclick", function(e) {
t.getMaxZoom() === t.getZoom() ? n && e.layer.spiderfy() : i && e.layer.zoomToBounds();
}, this), r && (this.on("clustermouseover", function(n) {
if (this._inZoomAnimation) return;
e && t.removeLayer(e), n.layer.getChildCount() > 2 && n.layer !== this._spiderfied && (e = new L.Polygon(n.layer.getConvexHull(), this.options.polygonOptions), t.addLayer(e));
}, this), this.on("clustermouseout", function() {
e && (t.removeLayer(e), e = null);
}, this), t.on("zoomend", function() {
e && (t.removeLayer(e), e = null);
}, this), t.on("layerremove", function(n) {
e && n.layer === this && (t.removeLayer(e), e = null);
}, this));
},
_unbindEvents: function() {
var e = this.options.spiderfyOnMaxZoom, t = this.options.showCoverageOnHover, n = this.options.zoomToBoundsOnClick, r = this._map;
(e || n) && this.off("clusterclick", null, this), t && (this.off("clustermouseover", null, this), this.off("clustermouseout", null, this), r.off("zoomend", null, this), r.off("layerremove", null, this));
},
_zoomEnd: function() {
if (!this._map) return;
this._mergeSplitClusters(), this._zoom = this._map._zoom, this._currentShownBounds = this._getExpandedVisibleBounds();
},
_moveEnd: function() {
if (this._inZoomAnimation) return;
var e = this._getExpandedVisibleBounds();
this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, this._zoom, e), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, e), this._currentShownBounds = e;
return;
},
_generateInitialClusters: function() {
var e = this._map.getMaxZoom(), t = this.options.maxClusterRadius;
this.options.disableClusteringAtZoom && (e = this.options.disableClusteringAtZoom - 1), this._maxZoom = e, this._gridClusters = {}, this._gridUnclustered = {};
for (var n = e; n >= 0; n--) this._gridClusters[n] = new L.DistanceGrid(t), this._gridUnclustered[n] = new L.DistanceGrid(t);
this._topClusterLevel = new L.MarkerCluster(this, -1);
},
_addLayer: function(e, t) {
var n = this._gridClusters, r = this._gridUnclustered, i, s;
this.options.singleMarkerMode && (e.options.icon = this.options.iconCreateFunction({
getChildCount: function() {
return 1;
},
getAllChildMarkers: function() {
return [ e ];
}
}));
for (; t >= 0; t--) {
i = this._map.project(e.getLatLng(), t);
var o = n[t].getNearObject(i);
if (o) {
o._addChild(e), e.__parent = o;
return;
}
o = r[t].getNearObject(i);
if (o) {
var u = o.__parent;
u && this._removeLayer(o, !1);
var a = new L.MarkerCluster(this, t, o, e);
n[t].addObject(a, this._map.project(a._cLatLng, t)), o.__parent = a, e.__parent = a;
var f = a;
for (s = t - 1; s > u._zoom; s--) f = new L.MarkerCluster(this, s, f), n[s].addObject(f, this._map.project(o.getLatLng(), s));
u._addChild(f);
for (s = t; s >= 0; s--) if (!r[s].removeObject(o, this._map.project(o.getLatLng(), s))) break;
return;
}
r[t].addObject(e, i);
}
this._topClusterLevel._addChild(e), e.__parent = this._topClusterLevel;
return;
},
_mergeSplitClusters: function() {
this._zoom < this._map._zoom ? (this._animationStart(), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, this._zoom, this._getExpandedVisibleBounds()), this._animationZoomIn(this._zoom, this._map._zoom)) : this._zoom > this._map._zoom ? (this._animationStart(), this._animationZoomOut(this._zoom, this._map._zoom)) : this._moveEnd();
},
_getExpandedVisibleBounds: function() {
if (!this.options.removeOutsideVisibleBounds) return this.getBounds();
var e = this._map, t = e.getBounds(), n = t._southWest, r = t._northEast, i = L.Browser.mobile ? 0 : Math.abs(n.lat - r.lat), s = L.Browser.mobile ? 0 : Math.abs(n.lng - r.lng);
return new L.LatLngBounds(new L.LatLng(n.lat - i, n.lng - s, !0), new L.LatLng(r.lat + i, r.lng + s, !0));
},
_animationAddLayerNonAnimated: function(e, t) {
if (t === e) L.FeatureGroup.prototype.addLayer.call(this, e); else if (t._childCount === 2) {
t._addToMap();
var n = t.getAllChildMarkers();
L.FeatureGroup.prototype.removeLayer.call(this, n[0]), L.FeatureGroup.prototype.removeLayer.call(this, n[1]);
} else t._updateIcon();
}
}), L.MarkerClusterGroup.include(L.DomUtil.TRANSITION ? {
_animationStart: function() {
this._map._mapPane.className += " leaflet-cluster-anim", this._inZoomAnimation++;
},
_animationEnd: function() {
this._map && (this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", "")), this._inZoomAnimation--, this.fire("animationend");
},
_animationZoomIn: function(e, t) {
var n = this, r = this._getExpandedVisibleBounds(), i;
this._topClusterLevel._recursively(r, e, 0, function(s) {
var o = s._latlng, u = s._markers, a;
s._isSingleParent() && e + 1 === t ? (L.FeatureGroup.prototype.removeLayer.call(n, s), s._recursivelyAddChildrenToMap(null, t, r)) : (s.setOpacity(0), s._recursivelyAddChildrenToMap(o, t, r));
for (i = u.length - 1; i >= 0; i--) a = u[i], r.contains(a._latlng) || L.FeatureGroup.prototype.removeLayer.call(n, a);
}), this._forceLayout();
var s, o;
n._topClusterLevel._recursivelyBecomeVisible(r, t);
for (s in n._layers) o = n._layers[s], !(o instanceof L.MarkerCluster) && o._icon && o.setOpacity(1);
n._topClusterLevel._recursively(r, e, t, function(e) {
e._recursivelyRestoreChildPositions(t);
}), setTimeout(function() {
n._topClusterLevel._recursively(r, e, 0, function(e) {
L.FeatureGroup.prototype.removeLayer.call(n, e), e.setOpacity(1);
}), n._animationEnd();
}, 200);
},
_animationZoomOut: function(e, t) {
this._animationZoomOutSingle(this._topClusterLevel, e - 1, t), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds()), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, e, this._getExpandedVisibleBounds());
},
_animationZoomOutSingle: function(e, t, n) {
var r = this._getExpandedVisibleBounds();
e._recursivelyAnimateChildrenInAndAddSelfToMap(r, t + 1, n);
var i = this;
this._forceLayout(), e._recursivelyBecomeVisible(r, n), setTimeout(function() {
if (e._childCount === 1) {
var s = e._markers[0];
s.setLatLng(s.getLatLng()), s.setOpacity(1);
} else e._recursively(r, n, 0, function(e) {
e._recursivelyRemoveChildrenFromMap(r, t + 1);
});
i._animationEnd();
}, 200);
},
_animationAddLayer: function(e, t) {
var n = this;
L.FeatureGroup.prototype.addLayer.call(this, e), t !== e && (t._childCount > 2 ? (t._updateIcon(), this._forceLayout(), this._animationStart(), e._setPos(this._map.latLngToLayerPoint(t.getLatLng())), e.setOpacity(0), setTimeout(function() {
L.FeatureGroup.prototype.removeLayer.call(n, e), e.setOpacity(1), n._animationEnd();
}, 200)) : (this._forceLayout(), n._animationStart(), n._animationZoomOutSingle(t, this._map.getMaxZoom(), this._map.getZoom())));
},
_forceLayout: function() {
L.Util.falseFn(document.body.offsetWidth);
}
} : {
_animationStart: function() {},
_animationZoomIn: function(e, t) {
this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, e), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds());
},
_animationZoomOut: function(e, t) {
this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, e), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds());
},
_animationAddLayer: function(e, t) {
this._animationAddLayerNonAnimated(e, t);
}
}), L.MarkerCluster = L.Marker.extend({
initialize: function(e, t, n, r) {
L.Marker.prototype.initialize.call(this, n ? n._cLatLng || n.getLatLng() : new L.LatLng(0, 0), {
icon: this
}), this._group = e, this._zoom = t, this._markers = [], this._childClusters = [], this._childCount = 0, this._iconNeedsUpdate = !0, this._bounds = new L.LatLngBounds, n && this._addChild(n), r && this._addChild(r);
},
getAllChildMarkers: function(e) {
e = e || [];
for (var t = this._childClusters.length - 1; t >= 0; t--) this._childClusters[t].getAllChildMarkers(e);
for (var n = this._markers.length - 1; n >= 0; n--) e.push(this._markers[n]);
return e;
},
getChildCount: function() {
return this._childCount;
},
zoomToBounds: function() {
this._group._map.fitBounds(this._bounds);
},
getBounds: function() {
var e = new L.LatLngBounds;
return e.extend(this._bounds), e;
},
_updateIcon: function() {
this._iconNeedsUpdate = !0, this._icon && this.setIcon(this);
},
createIcon: function() {
return this._iconNeedsUpdate && (this._iconObj = this._group.options.iconCreateFunction(this), this._iconNeedsUpdate = !1), this._iconObj.createIcon();
},
createShadow: function() {
return this._iconObj.createShadow();
},
_addChild: function(e, t) {
this._iconNeedsUpdate = !0, this._expandBounds(e), e instanceof L.MarkerCluster ? (t || (this._childClusters.push(e), e.__parent = this), this._childCount += e._childCount) : (t || this._markers.push(e), this._childCount++), this.__parent && this.__parent._addChild(e, !0);
},
_expandBounds: function(e) {
var t, n = e._wLatLng || e._latlng;
e instanceof L.MarkerCluster ? (this._bounds.extend(e._bounds), t = e._childCount) : (this._bounds.extend(n), t = 1), this._cLatLng || (this._cLatLng = e._cLatLng || n);
var r = this._childCount + t;
this._wLatLng ? (this._wLatLng.lat = (n.lat * t + this._wLatLng.lat * this._childCount) / r, this._wLatLng.lng = (n.lng * t + this._wLatLng.lng * this._childCount) / r) : this._latlng = this._wLatLng = new L.LatLng(n.lat, n.lng);
},
_addToMap: function(e) {
e && (this._backupLatlng = this._latlng, this.setLatLng(e)), this._noHas = !0, L.FeatureGroup.prototype.addLayer.call(this._group, this), delete this._noHas;
},
_recursivelyAnimateChildrenIn: function(e, t, n) {
this._recursively(e, 0, n - 1, function(e) {
var n = e._markers, r, i;
for (r = n.length - 1; r >= 0; r--) i = n[r], i._icon && (i._setPos(t), i.setOpacity(0));
}, function(e) {
var n = e._childClusters, r, i;
for (r = n.length - 1; r >= 0; r--) i = n[r], i._icon && (i._setPos(t), i.setOpacity(0));
});
},
_recursivelyAnimateChildrenInAndAddSelfToMap: function(e, t, n) {
this._recursively(e, n, 0, function(r) {
r._recursivelyAnimateChildrenIn(e, r._group._map.latLngToLayerPoint(r.getLatLng()).round(), t), r._isSingleParent() && t - 1 === n ? (r.setOpacity(1), r._recursivelyRemoveChildrenFromMap(e, t)) : r.setOpacity(0), r._addToMap();
});
},
_recursivelyBecomeVisible: function(e, t) {
this._recursively(e, 0, t, null, function(e) {
e.setOpacity(1);
});
},
_recursivelyAddChildrenToMap: function(e, t, n) {
this._recursively(n, -1, t, function(r) {
if (t === r._zoom) return;
for (var i = r._markers.length - 1; i >= 0; i--) {
var s = r._markers[i];
if (!n.contains(s._latlng)) continue;
e && (s._backupLatlng = s.getLatLng(), s.setLatLng(e), s.setOpacity(0)), s._noHas = !0, L.FeatureGroup.prototype.addLayer.call(r._group, s), delete s._noHas;
}
}, function(t) {
t._addToMap(e);
});
},
_recursivelyRestoreChildPositions: function(e) {
for (var t = this._markers.length - 1; t >= 0; t--) {
var n = this._markers[t];
n._backupLatlng && (n.setLatLng(n._backupLatlng), delete n._backupLatlng);
}
if (e - 1 === this._zoom) for (var r = this._childClusters.length - 1; r >= 0; r--) this._childClusters[r]._restorePosition(); else for (var i = this._childClusters.length - 1; i >= 0; i--) this._childClusters[i]._recursivelyRestoreChildPositions(e);
},
_restorePosition: function() {
this._backupLatlng && (this.setLatLng(this._backupLatlng), delete this._backupLatlng);
},
_recursivelyRemoveChildrenFromMap: function(e, t, n) {
var r, i;
this._recursively(e, -1, t - 1, function(e) {
for (i = e._markers.length - 1; i >= 0; i--) {
r = e._markers[i];
if (!n || !n.contains(r._latlng)) L.FeatureGroup.prototype.removeLayer.call(e._group, r), r.setOpacity(1);
}
}, function(e) {
for (i = e._childClusters.length - 1; i >= 0; i--) {
r = e._childClusters[i];
if (!n || !n.contains(r._latlng)) (!L.FeatureGroup.prototype.hasLayer || L.FeatureGroup.prototype.hasLayer.call(e._group, r)) && L.FeatureGroup.prototype.removeLayer.call(e._group, r), r.setOpacity(1);
}
});
},
_recursively: function(e, t, n, r, i) {
var s = this._childClusters, o = this._zoom, u, a;
if (t > o) for (u = s.length - 1; u >= 0; u--) a = s[u], e.intersects(a._bounds) && a._recursively(e, t, n, r, i); else {
r && r(this), i && this._zoom === n && i(this);
if (n > o) for (u = s.length - 1; u >= 0; u--) a = s[u], e.intersects(a._bounds) && a._recursively(e, t, n, r, i);
}
},
_recalculateBounds: function() {
var e = this._markers, t = this._childClusters, n;
this._bounds = new L.LatLngBounds, delete this._wLatLng;
for (n = e.length - 1; n >= 0; n--) this._expandBounds(e[n]);
for (n = t.length - 1; n >= 0; n--) this._expandBounds(t[n]);
},
_isSingleParent: function() {
return this._childClusters.length > 0 && this._childClusters[0]._childCount === this._childCount;
}
}), L.DistanceGrid = function(e) {
this._cellSize = e, this._sqCellSize = e * e, this._grid = {}, this._objectPoint = {};
}, L.DistanceGrid.prototype = {
addObject: function(e, t) {
var n = this._getCoord(t.x), r = this._getCoord(t.y), i = this._grid, s = i[r] = i[r] || {}, o = s[n] = s[n] || [], u = L.Util.stamp(e);
this._objectPoint[u] = t, o.push(e);
},
updateObject: function(e, t) {
this.removeObject(e), this.addObject(e, t);
},
removeObject: function(e, t) {
var n = this._getCoord(t.x), r = this._getCoord(t.y), i = this._grid, s = i[r] = i[r] || {}, o = s[n] = s[n] || [], u, a;
delete this._objectPoint[L.Util.stamp(e)];
for (u = 0, a = o.length; u < a; u++) if (o[u] === e) return o.splice(u, 1), a === 1 && delete s[n], !0;
},
eachObject: function(e, t) {
var n, r, i, s, o, u, a, f = this._grid;
for (n in f) {
o = f[n];
for (r in o) {
u = o[r];
for (i = 0, s = u.length; i < s; i++) a = e.call(t, u[i]), a && (i--, s--);
}
}
},
getNearObject: function(e) {
var t = this._getCoord(e.x), n = this._getCoord(e.y), r, i, s, o, u, a, f, l, c = this._objectPoint, h = this._sqCellSize, p = null;
for (r = n - 1; r <= n + 1; r++) {
o = this._grid[r];
if (o) for (i = t - 1; i <= t + 1; i++) {
u = o[i];
if (u) for (s = 0, a = u.length; s < a; s++) f = u[s], l = this._sqDist(c[L.Util.stamp(f)], e), l < h && (h = l, p = f);
}
}
return p;
},
_getCoord: function(e) {
return Math.floor(e / this._cellSize);
},
_sqDist: function(e, t) {
var n = t.x - e.x, r = t.y - e.y;
return n * n + r * r;
}
}, function() {
L.QuickHull = {
getDistant: function(e, t) {
var n = t[1].lat - t[0].lat, r = t[0].lng - t[1].lng;
return r * (e.lat - t[0].lat) + n * (e.lng - t[0].lng);
},
findMostDistantPointFromBaseLine: function(e, t) {
var n = 0, r = null, i = [], s, o, u;
for (s = t.length - 1; s >= 0; s--) {
o = t[s], u = this.getDistant(o, e);
if (!(u > 0)) continue;
i.push(o), u > n && (n = u, r = o);
}
return {
maxPoint: r,
newPoints: i
};
},
buildConvexHull: function(e, t) {
var n = [], r = this.findMostDistantPointFromBaseLine(e, t);
return r.maxPoint ? (n = n.concat(this.buildConvexHull([ e[0], r.maxPoint ], r.newPoints)), n = n.concat(this.buildConvexHull([ r.maxPoint, e[1] ], r.newPoints)), n) : [ e ];
},
getConvexHull: function(e) {
var t = !1, n = !1, r = null, i = null, s;
for (s = e.length - 1; s >= 0; s--) {
var o = e[s];
if (t === !1 || o.lat > t) r = o, t = o.lat;
if (n === !1 || o.lat < n) i = o, n = o.lat;
}
var u = [].concat(this.buildConvexHull([ i, r ], e), this.buildConvexHull([ r, i ], e));
return u;
}
};
}(), L.MarkerCluster.include({
getConvexHull: function() {
var e = this.getAllChildMarkers(), t = [], n = [], r, i, s;
for (s = e.length - 1; s >= 0; s--) i = e[s].getLatLng(), t.push(i);
r = L.QuickHull.getConvexHull(t);
for (s = r.length - 1; s >= 0; s--) n.push(r[s][0]);
return n;
}
}), L.MarkerCluster.include({
_2PI: Math.PI * 2,
_circleFootSeparation: 25,
_circleStartAngle: Math.PI / 6,
_spiralFootSeparation: 28,
_spiralLengthStart: 11,
_spiralLengthFactor: 5,
_circleSpiralSwitchover: 9,
spiderfy: function() {
if (this._group._spiderfied === this || this._group._inZoomAnimation) return;
var e = this.getAllChildMarkers(), t = this._group, n = t._map, r = n.latLngToLayerPoint(this._latlng), i;
this._group._unspiderfy(), this._group._spiderfied = this, e.length >= this._circleSpiralSwitchover ? i = this._generatePointsSpiral(e.length, r) : (r.y += 10, i = this._generatePointsCircle(e.length, r)), this._animationSpiderfy(e, i);
},
unspiderfy: function(e) {
if (this._group._inZoomAnimation) return;
this._animationUnspiderfy(e), this._group._spiderfied = null;
},
_generatePointsCircle: function(e, t) {
var n = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + e), r = n / this._2PI, i = this._2PI / e, s = [], o, u;
s.length = e;
for (o = e - 1; o >= 0; o--) u = this._circleStartAngle + o * i, s[o] = (new L.Point(t.x + r * Math.cos(u), t.y + r * Math.sin(u)))._round();
return s;
},
_generatePointsSpiral: function(e, t) {
var n = this._group.options.spiderfyDistanceMultiplier * this._spiralLengthStart, r = this._group.options.spiderfyDistanceMultiplier * this._spiralFootSeparation, i = this._group.options.spiderfyDistanceMultiplier * this._spiralLengthFactor, s = 0, o = [], u;
o.length = e;
for (u = e - 1; u >= 0; u--) s += r / n + u * 5e-4, o[u] = (new L.Point(t.x + n * Math.cos(s), t.y + n * Math.sin(s)))._round(), n += this._2PI * i / s;
return o;
},
_noanimationUnspiderfy: function() {
var e = this._group, t = e._map, n = this.getAllChildMarkers(), r, i;
this.setOpacity(1);
for (i = n.length - 1; i >= 0; i--) r = n[i], L.FeatureGroup.prototype.removeLayer.call(e, r), r._preSpiderfyLatlng && (r.setLatLng(r._preSpiderfyLatlng), delete r._preSpiderfyLatlng), r.setZIndexOffset(0), r._spiderLeg && (t.removeLayer(r._spiderLeg), delete r._spiderLeg);
}
}), L.MarkerCluster.include(L.DomUtil.TRANSITION ? {
SVG_ANIMATION: function() {
return document.createElementNS("http://www.w3.org/2000/svg", "animate").toString().indexOf("SVGAnimate") > -1;
}(),
_animationSpiderfy: function(e, t) {
var n = this, r = this._group, i = r._map, s = i.latLngToLayerPoint(this._latlng), o, u, a, f;
for (o = e.length - 1; o >= 0; o--) u = e[o], u.setZIndexOffset(1e6), u.setOpacity(0), u._noHas = !0, L.FeatureGroup.prototype.addLayer.call(r, u), delete u._noHas, u._setPos(s);
r._forceLayout(), r._animationStart();
var l = L.Path.SVG ? 0 : .3, c = L.Path.SVG_NS;
for (o = e.length - 1; o >= 0; o--) {
f = i.layerPointToLatLng(t[o]), u = e[o], u._preSpiderfyLatlng = u._latlng, u.setLatLng(f), u.setOpacity(1), a = new L.Polyline([ n._latlng, f ], {
weight: 1.5,
color: "#222",
opacity: l
}), i.addLayer(a), u._spiderLeg = a;
if (!L.Path.SVG || !this.SVG_ANIMATION) continue;
var h = a._path.getTotalLength();
a._path.setAttribute("stroke-dasharray", h + "," + h);
var p = document.createElementNS(c, "animate");
p.setAttribute("attributeName", "stroke-dashoffset"), p.setAttribute("begin", "indefinite"), p.setAttribute("from", h), p.setAttribute("to", 0), p.setAttribute("dur", .25), a._path.appendChild(p), p.beginElement(), p = document.createElementNS(c, "animate"), p.setAttribute("attributeName", "stroke-opacity"), p.setAttribute("attributeName", "stroke-opacity"), p.setAttribute("begin", "indefinite"), p.setAttribute("from", 0), p.setAttribute("to", .5), p.setAttribute("dur", .25), a._path.appendChild(p), p.beginElement();
}
n.setOpacity(.3);
if (L.Path.SVG) {
this._group._forceLayout();
for (o = e.length - 1; o >= 0; o--) u = e[o]._spiderLeg, u.options.opacity = .5, u._path.setAttribute("stroke-opacity", .5);
}
setTimeout(function() {
r._animationEnd(), r.fire("spiderfied");
}, 200);
},
_animationUnspiderfy: function(e) {
var t = this._group, n = t._map, r = e ? n._latLngToNewLayerPoint(this._latlng, e.zoom, e.center) : n.latLngToLayerPoint(this._latlng), i = this.getAllChildMarkers(), s = L.Path.SVG && this.SVG_ANIMATION, o, u, a;
t._animationStart(), this.setOpacity(1);
for (u = i.length - 1; u >= 0; u--) {
o = i[u];
if (!o._preSpiderfyLatlng) continue;
o.setLatLng(o._preSpiderfyLatlng), delete o._preSpiderfyLatlng, o._setPos(r), o.setOpacity(0), s && (a = o._spiderLeg._path.childNodes[0], a.setAttribute("to", a.getAttribute("from")), a.setAttribute("from", 0), a.beginElement(), a = o._spiderLeg._path.childNodes[1], a.setAttribute("from", .5), a.setAttribute("to", 0), a.setAttribute("stroke-opacity", 0), a.beginElement(), o._spiderLeg._path.setAttribute("stroke-opacity", 0));
}
setTimeout(function() {
var e = 0;
for (u = i.length - 1; u >= 0; u--) o = i[u], o._spiderLeg && e++;
for (u = i.length - 1; u >= 0; u--) {
o = i[u];
if (!o._spiderLeg) continue;
o.setOpacity(1), o.setZIndexOffset(0), e > 1 && L.FeatureGroup.prototype.removeLayer.call(t, o), n.removeLayer(o._spiderLeg), delete o._spiderLeg;
}
t._animationEnd();
}, 200);
}
} : {
_animationSpiderfy: function(e, t) {
var n = this._group, r = n._map, i, s, o, u;
for (i = e.length - 1; i >= 0; i--) u = r.layerPointToLatLng(t[i]), s = e[i], s._preSpiderfyLatlng = s._latlng, s.setLatLng(u), s.setZIndexOffset(1e6), L.FeatureGroup.prototype.addLayer.call(n, s), o = new L.Polyline([ this._latlng, u ], {
weight: 1.5,
color: "#222"
}), r.addLayer(o), s._spiderLeg = o;
this.setOpacity(.3), n.fire("spiderfied");
},
_animationUnspiderfy: function() {
this._noanimationUnspiderfy();
}
}), L.MarkerClusterGroup.include({
_spiderfied: null,
_spiderfierOnAdd: function() {
this._map.on("click", this._unspiderfyWrapper, this), this._map.options.zoomAnimation ? this._map.on("zoomstart", this._unspiderfyZoomStart, this) : this._map.on("zoomend", this._unspiderfyWrapper, this), L.Path.SVG && !L.Browser.touch && this._map._initPathRoot();
},
_spiderfierOnRemove: function() {
this._map.off("click", this._unspiderfyWrapper, this), this._map.off("zoomstart", this._unspiderfyZoomStart, this), this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._unspiderfy();
},
_unspiderfyZoomStart: function() {
if (!this._map) return;
this._map.on("zoomanim", this._unspiderfyZoomAnim, this);
},
_unspiderfyZoomAnim: function(e) {
if (L.DomUtil.hasClass(this._map._mapPane, "leaflet-touching")) return;
this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._unspiderfy(e);
},
_unspiderfyWrapper: function() {
this._unspiderfy();
},
_unspiderfy: function(e) {
this._spiderfied && this._spiderfied.unspiderfy(e);
},
_noanimationUnspiderfy: function() {
this._spiderfied && this._spiderfied._noanimationUnspiderfy();
},
_unspiderfyLayer: function(e) {
e._spiderLeg && (L.FeatureGroup.prototype.removeLayer.call(this, e), e.setOpacity(1), e.setZIndexOffset(0), this._map.removeLayer(e._spiderLeg), delete e._spiderLeg);
}
});
})(this);

// namespace.js

wb = {
map: {
model: {},
assets: {},
constants: {}
}
};

// Constants.js

wb.map.assets = {
userObservationMarker: function(e) {
return L.divIcon({
className: "div_icon",
html: "<img src='assets/user_icon.png'><div class='num_of_samples'>" + e + "</div>",
iconSize: [ 32, 32 ],
popupAnchor: [ 0, -16 ]
});
},
buoyObservationMarker: function(e) {
return L.divIcon({
className: "div_icon",
html: "<img src='assets/buoy_icon.png'><div class='num_of_samples'>" + e + "</div>",
iconSize: [ 32, 32 ],
popupAnchor: [ 0, -16 ]
});
},
schoolObservationMarker: function(e) {
return L.divIcon({
className: "div_icon",
html: "<img src='assets/station_icon.png'><div class='num_of_samples'>" + e + "</div>",
iconSize: [ 32, 32 ],
popupAnchor: [ 0, -16 ]
});
},
userObservationCluster: L.divIcon({
className: "div_icon",
html: "<img src='assets/user_icon.png'><div class='cluster_pill'>more</div>",
iconSize: [ 32, 32 ]
}),
buoyObservationCluster: L.divIcon({
className: "div_icon",
html: "<img src='assets/buoy_icon.png'><div class='cluster_pill'>more</div>",
iconSize: [ 32, 32 ]
}),
schoolObservationCluster: L.divIcon({
className: "div_icon",
html: "<img src='assets/station_icon.png'><div class='cluster_pill'>more</div>",
iconSize: [ 32, 32 ]
})
}, wb.map.env = {
aggregatorService: location.pathname.indexOf("debug.html") !== -1 || location.port == 7777 ? "//localhost:7777/wb-aggregator" : "",
momentDateFormat: "MM/DD/YYYY"
};

// CalendarInputs.js

enyo.kind({
name: "CalendarInputs",
classes: "control-sub-content ",
events: {
onPickDate: ""
},
components: [ {
controlClasses: "enyo-inline",
components: [ {
content: "From: "
}, {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
kind: "onyx.Input",
name: "fromDate",
classes: "",
placeholder: "MM/DD/YY"
} ]
}, {
kind: "onyx.Icon",
src: "assets/calendar.png",
ontap: "pickFromDate"
} ]
}, {
controlClasses: "enyo-inline",
components: [ {
content: "To: "
}, {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
kind: "onyx.Input",
name: "toDate",
classes: "",
placeholder: "MM/DD/YY"
} ]
}, {
kind: "onyx.Icon",
src: "assets/calendar.png",
ontap: "doShowCalendar"
} ]
} ],
doShowCalendar: function(e, t) {
console.log("calendar tapped");
},
pickToDate: function(e, t) {
console.log("calendar tapped"), this.doPickDate({
activeInput: this.$.toDate,
isFromDate: !1
});
}
});

// DatePickCalendar.js

enyo.kind({
kind: "onyx.Popup",
name: "wb.DatePickCalendar",
centered: !0,
floating: !0,
scrim: !0,
autoDismiss: !1,
modal: !0,
classes: "calendar-popup",
components: [ {
name: "header",
components: [ {
tag: "i",
classes: "icon-circle-arrow-left",
ontap: "prevMonth"
}, {
kind: "onyx.DatePicker",
onSelect: "doPickerChanged"
}, {
tag: "i",
classes: "icon-circle-arrow-right",
ontap: "nextMonth"
} ]
}, {
kind: "CalendarSelector",
onDaySet: "doCalendarChanged"
}, {
kind: "onyx.Button",
content: " Cancel",
classes: "icon-remove",
ontap: "hide"
}, {
kind: "onyx.Button",
content: " Done",
classes: "icon-ok",
ontap: "doSaveAndHide"
} ],
create: function() {
this.inherited(arguments);
if (!this.field) throw "wb.DatePickCalendar requires a 'field' property.";
},
doCalendarChanged: function(e, t) {
var n = moment(e.getValue()), r = moment(t.control.getValue());
if (!n.isSame(r, "day")) return;
_.each(e.getDays(), function(e) {
e.addRemoveClass("day-selected", !1);
}, this), t.control.addRemoveClass("day-selected", !0), this.$.datePicker.setValue(n.toDate());
},
doPickerChanged: function(e, t) {
this.$.calendarSelector.setValue(t.value);
},
nextMonth: function() {
this.$.calendarSelector.nextMonth();
},
prevMonth: function() {
this.$.calendarSelector.prevMonth();
},
doSaveAndHide: function() {
this.field.setValue(moment(this.$.datePicker.getValue()).format(wb.map.env.momentDateFormat)), this.field.bubble("onValueChanged"), this.hide();
}
});

// ObservationInfoWindow.js

enyo.kind({
name: "wb.ObservationInfoWindow",
kind: "FittableRows",
classes: "observation-info-window",
published: {
observation: null
},
components: [ {
kind: "enyo.Signals",
onObservationResponse: "handleObservationResponse"
}, {
kind: "FittableColumns",
classes: "header",
components: [ {
kind: "Image",
name: "userAvatar",
classes: "avatar"
}, {
kind: "FittableRows",
fit: !0,
components: [ {
name: "username"
}, {
name: "investigationTitle"
}, {
controlClasses: "enyo-inline",
components: [ {
content: "Recorded Date: ",
classes: "phenomenon"
}, {
name: "recordedDate",
style: "margin-right: 1em"
}, {
content: "Location: ",
classes: "phenomenon"
}, {
name: "location"
} ]
} ]
} ]
}, {
classes: "thumbnailContainer",
controlClasses: "enyo-inline",
components: [ {
tag: "i",
name: "imageThumbnailPlaceholder",
classes: "icon-camera placeholder"
}, {
tag: "i",
name: "videoThumbnailPlaceholder",
classes: "icon-facetime-video placeholder"
}, {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "ImageView",
name: "imageThumbnail",
classes: "thumbnail image",
scale: "height",
ontap: "doThumbnailTap"
}, {
kind: "onyx.Tooltip",
name: "imageThumbnailTooltip",
content: "No image available for this observation."
} ]
}, {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "ImageView",
name: "videoThumbnail",
classes: "thumbnail video",
scale: "height",
ontap: "doThumbnailTap"
}, {
kind: "onyx.Tooltip",
name: "videoThumbnailTooltip",
content: "No video available for this observation."
} ]
} ]
}, {
controlClasses: "enyo-inline",
classes: "measurements-header",
components: [ {
tag: "h3",
content: "Measurements"
}, {
content: "(Scroll for more)",
classes: "subtitle"
} ]
}, {
kind: "Scroller",
classes: "measurements-container",
touch: !0,
components: [ {
kind: "Repeater",
onSetupItem: "setupMeasurementItem",
components: [ {
controlClasses: "enyo-inline",
classes: "list-item",
components: [ {
name: "phenomenon",
classes: "phenomenon"
}, {
name: "value",
classes: "value"
} ]
} ]
} ]
} ],
doThumbnailTap: function(e, t) {},
setupMeasurementItem: function(e, t) {
var n = this.observation.measurements[t.index];
t.item.$.value.setContent(n.value + " " + n.phenomenon.unit.name), t.item.$.phenomenon.setContent(n.phenomenon.name);
},
handleObservationResponse: function(e, t) {
if (this.observation.properties.id !== t.observation.id) return;
_.extend(this.observation, t.observation);
var n = this.observation.measurements;
this.$.recordedDate.setContent(wb.Util.prettifyDate(this.observation.timestamp)), this.$.location.setContent("(" + this.observation.location.lng.toFixed(5) + ", " + this.observation.location.lat.toFixed(5) + ")"), this.$.repeater.setCount(n.length), _.each(_.filter(n, function(e) {
return _.contains([ "image", "video" ], e.phenomenon.name);
}), function(e) {
var t = e.phenomenon.name, n = JSON.parse(e.meta) || {};
this.$[t + "ThumbnailPlaceholder"].setShowing(!1), this.$[t + "Thumbnail"].setSrc(n.thumbnailUrl || n.url), this.$[t + "ThumbnailTooltip"].setContent(n.caption || "No caption provided.");
}, this), this.$.investigationTitle.setContent("Default Weatherblur Investigation"), this.$.userAvatar.setSrc("assets/foss4glogo.png"), this.$.username.setContent("FOSS4G Demo User");
}
});

// MapGrowl.js

enyo.kind({
kind: "enyo.Popup",
name: "nbt.MapGrowl",
published: {
data: null
},
components: [ {
kind: "enyo.Signals",
onMapGrowlReposition: "doReposition"
}, {
name: "growl"
} ],
dataChanged: function(e) {
console.log(this.data), this.$.growl.setContent(this.data);
},
doReposition: function(e, t) {
this.showAtPosition({
top: t.top,
right: t.right
});
}
});

// ZoomControl.js

enyo.kind({
name: "wb.ZoomControl",
kind: "FittableRows",
classes: "leaflet-control-zoom leaflet-bar leaflet-control wb-zoom-control",
published: {
map: null
},
components: [ {
kind: "Image",
src: "assets/zoom_in_icon.png",
style: "cursor: pointer",
ontap: "handleZoomIn"
}, {
kind: "Image",
src: "assets/zoom_out_icon.png",
style: "cursor: pointer",
ontap: "handleZoomOut"
} ],
handleZoomIn: function(e, t) {
this.map.zoomIn();
},
handleZoomOut: function(e, t) {
this.map.zoomOut();
}
});

// TitledDrawer.js

enyo.kind({
name: "wb.TitledDrawer",
classes: "titled-drawer",
style: "width: 100%",
components: [ {
controlClasses: "enyo-inline",
name: "container",
ontap: "doDrawerToggle",
components: [ {
tag: "i",
name: "icon",
classes: "icon-collapse-alt"
}, {
classes: "text",
name: "title"
} ]
}, {
kind: "onyx.Drawer"
} ],
create: function() {
this.inherited(arguments), this.$.container.setClasses(this.titleClasses), this.$.title.setContent(this.title), this.$.drawer.createComponents(this.drawerComponents, {
owner: this.owner
});
},
doDrawerToggle: function(e, t) {
var n = this.$.drawer.open;
this.$.drawer.setOpen(!n), this.$.icon.addRemoveClass("icon-collapse-alt", !n), this.$.icon.addRemoveClass("icon-expand-alt", n);
}
});

// MapView.js

enyo.kind({
name: "wb.MapView",
statics: {
stratifyObservationsByLocation: function(e) {
return _.countBy(e, function(e) {
return e.geometry.coordinates.join(",");
});
},
reverseCoordinates: function(e) {
return _.sortBy(e, function(e, t) {
return -t;
});
}
},
components: [ {
kind: "enyo.Signals",
onToggleSchool: "doToggleSchoolLayer",
onToggleBuoy: "doToggleBuoyLayer",
onToggleObservation: "doToggleObservationLayer",
onToggleRadar: "doToggleRadarLayer",
onToggleSeaTemp: "doToggleSeaTempLayer"
}, {
name: "mapContainer",
classes: "enyo-fit"
}, {
kind: "wb.ZoomControl"
}, {
kind: "nbt.MapGrowl",
name: "mapGrowl"
} ],
published: {
map: null,
oms: null,
userObservationGroup: null
},
rendered: function() {
this.map = L.map(this.$.mapContainer.getId(), {
center: [ 43.133595, -68.32664 ],
zoom: 7,
maxZoom: 13,
zoomControl: !1,
attributionControl: !1
}), nbt.geo.leaflet.getNbtAttribution("bottomleft", "maroon").addTo(this.map), this.$.zoomControl.setMap(this.map), nbt.geo.leaflet.getArcGISTileLayer("Ocean_Basemap").addTo(this.map), this.userObsCluster = new L.MarkerClusterGroup({
iconCreateFunction: function(e) {
return wb.map.assets.userObservationCluster;
},
spiderfyOnMaxZoom: !0,
showCoverageOnHover: !1
}), this.buoyCluster = new L.MarkerClusterGroup({
iconCreateFunction: function(e) {
return wb.map.assets.buoyObservationCluster;
},
spiderfyOnMaxZoom: !0,
spiderfyDistanceMultiplier: 2.5,
showCoverageOnHover: !1
}), this.schoolCluster = new L.MarkerClusterGroup({
iconCreateFunction: function(e) {
return wb.map.assets.schoolObservationCluster;
},
spiderfyOnMaxZoom: !0,
spiderfyDistanceMultiplier: 2.5,
showCoverageOnHover: !1
}), this.map.on("popupopen", function(e) {
var t = e.popup.options.observation;
(new enyo.JsonpRequest({
url: wb.map.env.aggregatorService + "/observation/" + t.properties.id,
callbackName: "callback"
})).go({
callback: "cb",
q: JSON.stringify({
sensorDescriptor: {
providerName: "User"
}
})
}).response(this, function(e, t) {
enyo.Signals.send("onObservationResponse", {
observation: t
});
});
var n = this.map.latLngToContainerPoint(new L.LatLng(t.geometry.coordinates[1], t.geometry.coordinates[0])), r = this.map.getSize().y;
this.map.panBy(new L.Point(0, -(r - n.y) + 20));
}, this), this.observationLayer = L.layerGroup(), this.schoolLayer = L.layerGroup(), this.buoyLayer = L.layerGroup(), this.radarLayer = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
layers: "RAS_RIDGE_NEXRAD",
format: "image/png",
transparent: !0,
attribution: "Weather: NOAA",
opacity: .5
}), this.map.addLayer(this.radarLayer), this.seaTempLayer = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
layers: "OBS_MAR_SSTF",
format: "image/png",
transparent: !0,
attribution: "Weather: NOAA"
}), this.map.addLayer(this.seaTempLayer);
var e = wb.map.env.aggregatorService + "/observation/query";
(new enyo.JsonpRequest({
url: e,
callbackName: "callback"
})).go({
callback: "cb",
q: JSON.stringify({
sensorDescriptor: {
providerName: "User"
}
})
}).response(this, function(e, t) {
this.showObservations(t, wb.map.assets.userObservationMarker, this.observationLayer, this.userObsCluster, wb.ObservationInfoWindow);
}), (new enyo.JsonpRequest({
url: "//dev.nbtsolutions.net/schools.php",
callbackName: "callback"
})).go({
callback: "cb",
q: JSON.stringify({
sensorDescriptor: {
providerName: "User"
}
})
}).response(this, function(e, t) {
this.showObservations(t, wb.map.assets.schoolObservationMarker, this.schoolLayer, this.schoolCluster);
}), (new enyo.JsonpRequest({
url: "//dev.nbtsolutions.net/buoys.php",
callbackName: "callback"
})).go({
callback: "cb",
q: JSON.stringify({
sensorDescriptor: {
providerName: "User"
}
})
}).response(this, function(e, t) {
this.showObservations(t, wb.map.assets.buoyObservationMarker, this.buoyLayer, this.buoyCluster);
});
},
visitGeojsonCluster: function(e, t, n, r, i) {
_.each(i, function(t) {
var s = L.marker(wb.MapView.reverseCoordinates(t.geometry.coordinates), {
icon: e(i.length)
});
r && s.bindPopup((new r({
observation: t
})).render().hasNode(), {
observation: t,
maxWidth: 9999,
autoPanPadding: new L.Point(10, 10),
autoPan: !0
}), n.addLayer(s);
}, this);
},
showObservations: function(e, t, n, r, i) {
var s = wb.MapView.stratifyObservationsByLocation(e), o = _.groupBy(e, function(e) {
return e.geometry.coordinates.join(",");
});
_.each(_.values(o), enyo.bind(this, "visitGeojsonCluster", t, n, r, i)), r.addTo(this.map);
},
updateContextualPopup: function(e, t) {},
doToggleSchoolLayer: function(e, t) {
t.selected ? this.map.addLayer(this.schoolCluster) : this.map.removeLayer(this.schoolCluster);
},
doToggleObservationLayer: function(e, t) {
t.selected ? this.map.addLayer(this.userObsCluster) : this.map.removeLayer(this.userObsCluster);
},
doToggleBuoyLayer: function(e, t) {
t.selected ? this.map.addLayer(this.buoyCluster) : this.map.removeLayer(this.buoyCluster);
},
doToggleRadarLayer: function(e, t) {
t.selected ? this.map.addLayer(this.radarLayer) : this.map.removeLayer(this.radarLayer);
},
doToggleSeaTempLayer: function(e, t) {
t.selected ? this.map.addLayer(this.seaTempLayer) : this.map.removeLayer(this.seaTempLayer);
}
});

// ControlView.js

enyo.kind({
name: "wb.ControlView",
kind: "enyo.Slideable",
classes: "layer-control",
max: 100,
value: 0,
unit: "%",
overMoving: !1,
components: [ {
name: "shadow",
classes: "pullout-shadow"
}, {
kind: "onyx.Grabber",
classes: "pullout-grabbutton",
ontap: "onGrabberTap"
}, {
kind: "Scroller",
touch: !0,
classes: "enyo-fit",
components: [ {
kind: "wb.TitledDrawer",
title: "Data Sources",
titleClasses: "heading",
drawerComponents: [ {
name: "baseGroup",
classes: "sub-content",
components: [ {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "studentObservationSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "toggleObservation"
}, {
name: "userObservationLayerLegend",
kind: "Image",
classes: "mapLegend",
src: "assets/user_legend_icon.png"
}, {
content: "User Observations"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
kind: "onyx.Checkbox",
name: "schoolLayerSelect",
classes: "filter-checkbox",
checked: !0,
onchange: "toggleSchool"
}, {
name: "schoolLayerLegend",
kind: "Image",
classes: "mapLegend",
src: "assets/station_legend_icon.png"
}, {
content: "School Weather Stations"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "buoyLayerSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "toggleBuoy"
}, {
name: "buoyLayerLegend",
kind: "Image",
classes: "mapLegend",
src: "assets/buoy_legend_icon.png"
}, {
content: "Buoys"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "radarLayerSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "toggleRadar"
}, {
name: "radarLayerLegend",
kind: "Image",
classes: "mapLegend",
src: "assets/radar_legend_icon.png"
}, {
content: "NOAA Radar"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "tempLayerSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "toggleSeaTemp"
}, {
name: "tempLayerLegend",
kind: "Image",
classes: "mapLegend",
src: "assets/sea_temp_legend_icon.png"
}, {
content: "NOAA Surface Temps"
} ]
} ]
} ]
}, {
kind: "wb.TitledDrawer",
title: "User Observations",
titleClasses: "heading",
drawerComponents: [ {
name: "userGroup",
classes: "sub-content",
components: [ {
content: "Filter by Type:",
classes: "sub-heading"
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "photoTypeSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "checkboxChanged"
}, {
content: "Photo"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "videoTypeSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "checkboxChanged"
}, {
content: "Video"
} ]
}, {
content: "Measurements:",
classes: "sub-heading"
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "windSpeedSelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "checkboxChanged"
}, {
content: "wind speed"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
name: "visibilitySelect",
kind: "onyx.Checkbox",
classes: "filter-checkbox",
checked: !0,
onchange: "checkboxChanged"
}, {
content: "visibility"
} ]
} ]
} ]
}, {
kind: "wb.TitledDrawer",
title: "Date Filter",
titleClasses: "heading",
classes: "date",
drawerComponents: [ {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
content: "From: ",
classes: "left-column"
}, {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
kind: "onyx.Input",
name: "fromDate",
classes: "",
placeholder: "MM/DD/YY",
onValueChanged: "doValidateDateFields"
} ]
}, {
kind: "onyx.Button",
classes: "icon-calendar",
ontap: "doShowCalendar",
field: "fromDate"
} ]
}, {
controlClasses: "enyo-inline",
classes: "filter",
components: [ {
content: "To: ",
classes: "left-column"
}, {
kind: "onyx.InputDecorator",
alwaysLooksFocused: !0,
components: [ {
kind: "onyx.Input",
name: "toDate",
classes: "",
placeholder: "MM/DD/YY",
onValueChanged: "doValidateDateFields"
} ]
}, {
kind: "onyx.Button",
classes: "icon-calendar",
ontap: "doShowCalendar",
field: "toDate"
} ]
}, {
kind: "onyx.Button",
content: "Today",
classes: "button",
ontap: "doDateRangeOptionTap"
}, {
kind: "onyx.Button",
content: "Past Week",
ontap: "doDateRangeOptionTap"
}, {
kind: "onyx.Button",
content: "Past Month",
ontap: "doDateRangeOptionTap"
} ]
} ]
} ],
doValidateDateFields: function(e, t) {
var n = this.$.fromDate.getValue(), r = this.$.toDate.getValue();
if (!n || !r) return;
moment(r).isBefore(moment(n)) && (alert("Your end date must not occur before your start date"), e.setValue(null));
},
doShowCalendar: function(e, t) {
(new wb.DatePickCalendar({
field: this.$[e.field]
})).show();
},
doDateRangeOptionTap: function(e, t) {
var n = moment();
e.getContent() == "Past Week" ? n = n.subtract("weeks", 1) : e.getContent() == "Past Month" && (n = n.subtract("months", 1)), this.$.fromDate.setValue(n.format(wb.map.env.momentDateFormat)), this.$.toDate.setValue(moment().format(wb.map.env.momentDateFormat));
},
onGrabberTap: function(e, t) {
this.toggleMinMax();
},
toggleSchool: function(e, t) {
enyo.Signals.send("onToggleSchool", {
selected: e.getValue()
});
},
toggleBuoy: function(e, t) {
enyo.Signals.send("onToggleBuoy", {
selected: e.getValue()
});
},
toggleObservation: function(e, t) {
enyo.Signals.send("onToggleObservation", {
selected: e.getValue()
});
},
toggleRadar: function(e, t) {
enyo.Signals.send("onToggleRadar", {
selected: e.getValue()
});
},
toggleSeaTemp: function(e, t) {
enyo.Signals.send("onToggleSeaTemp", {
selected: e.getValue()
});
}
});

// App.js

enyo.kind({
name: "wb.Map",
components: [ {
kind: "wb.MapView"
}, {
kind: "wb.ControlView"
} ]
});

// Util.js

enyo.kind({
name: "wb.Util",
statics: {
prettifyDate: function(e) {
return moment(e).format("MMMM Do YYYY, h:mm a");
}
}
});

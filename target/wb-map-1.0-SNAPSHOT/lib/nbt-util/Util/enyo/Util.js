/**
 * Attach String.format function; http://stackoverflow.com/a/4673436/291180
 */
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number]
				: match
			  ;
		});
	};
}
enyo.kind({
	name: "nbt.Util",
	statics: {
		/**
		 * Returns true if a scrollbar is rendered in the given node, and false
		 * otherwise.
		 *
		 * @param node	A rendered DOM node
		 */
		isScrollbarRendered: function(node) {
			return node.scrollHeight > node.clientHeight;
		},
		/**
		 * Returns the default scrollbar width for the current browser.
		 * Adapted from: http://www.alexandre-gomes.com/?p=115
		 *
		 * @depends body.onload
		 * @returns width of scrollbar in pixels
		 */
		getScrollbarWidth: function() {
			var inner = document.createElement('p');
			inner.style.width = "100%";
			inner.style.height = "200px";

			var outer = document.createElement('div');
			outer.style.position = "absolute";
			outer.style.top = "0px";
			outer.style.left = "0px";
			outer.style.visibility = "hidden";
			outer.style.width = "200px";
			outer.style.height = "150px";
			outer.style.overflow = "hidden";
			outer.appendChild (inner);

			document.body.appendChild (outer);
			var w1 = inner.offsetWidth;
			outer.style.overflow = 'scroll';
			var w2 = inner.offsetWidth;
			if (w1 == w2) w2 = outer.clientWidth;

			document.body.removeChild (outer);

			return (w1 - w2);
		},
		zeroFill: function(number, width) {
			width -= number.toString().length;
			if ( width > 0 ) {
				return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
			}
			return number + ""; // always return a string
		}
	}
});

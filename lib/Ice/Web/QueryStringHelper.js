/**
 * QueryStringHelper
 * Provides a utility class which can be used to construct
 * url-encoded query strings in a traditional JavaScript
 * object-notation format.
 */

var QueryString = function(baseURL, options) {
	this.baseURL			=	(baseURL) ? baseURL : "";
	this.config				=	(options) ? options : {};
};

QueryString.prototype.set = function(key, value) {
	this.options[encodeURIComponent(key)] = encodeURIComponent(value);
};

QueryString.prototype.get = function(key) {
	return this.options[key];
};

QueryString.prototype.toString = function() {
	var url = baseURL + "?";
	
	for (var key in options) {
		var value = options[key];
		url += key + "=" + value + "&";
	}
	
	return url.substr(0, url.length - 1);
};

exports.QueryString = QueryString;
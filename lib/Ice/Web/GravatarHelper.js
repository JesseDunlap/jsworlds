/**
 * GravatarHelper
 * Implements various methods for manipulating and interacting
 * with Gravatar profile images.
 */

var MD5 = require("MD5");
var QueryString = require("./QueryStringHelper").QueryString;

exports.ProfileImageType = {
	"404": 			"404",
	MysterMan: 		"mm",
	Identicon: 		"identicon",
	Monster: 		"monsterid",
	Wavatar: 		"wavatar",
	Retro: 			"retro",
	Blank: 			"blank"
};

exports.Rating = {
	G: 				"g",
	PG: 			"pg",
	R: 				"r",
	X: 				"x"
};

exports.getProfileImage = function(email, options) {
	if (options === undefined) options = {};
	
	var hashedEmail		=	MD5(email);
	
	if (options.secure == true)
		var baseURL			=	"https://secure.gravatar.com/avatar/" + hashedEmail + "?";
	else
		var baseURL			=	"http://gravatar.com/avatar/" + hashedEmail + "?";
	
	var queryString		=	new QueryString(baseURL, {});
	
	if (options.size)
		queryString.set("s", options.size);
	
	if (options.defaultImage)
		queryString.set("d", options.defaultImage);
	
	if (options.forceDefault == true)
		queryString.set("f", "y");
	
	if (options.rating)
		queryString.set("r", options.rating);
		
	return queryString.toString();
};
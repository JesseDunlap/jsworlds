/**
 * Strings Module
 * Allows you to quickly use localized strings for your application by using P.string or P.str.
 * Strings will be looked for in the "app/strings" directory corresponding to the localization in the
 * environment config.
 */

exports.module = function(P) {
    var stringsDirectory 	= "app/strings/" + P.config.localization + "/",
 		allStrings			= require('fs').readdirSync(stringsDirectory);
		
	if (P.strings === undefined) P.strings = {};

    P.string = function(stringName) {
		if (P.strings[stringName] !== undefined) {
			return P.strings[stringName];
		}
		
		else {
	        if (require('fs').existsSync(stringsDirectory + stringName + ".string")) {
	            P.strings[stringName] = require('fs').readFileSync(stringsDirectory + stringName + ".string").toString();
				return P.strings[stringName];
			}
        
			else {
	            P.log.warning(stringName + " does not exist. Check " + stringsDirectory);
	            return "";
	        }
		}	
    };

    P.str = P.string;

	/* Loop through and preload every string */
	allStrings.forEach(function(string) {
		P.string(string.replace(".string", ""));
	});
};
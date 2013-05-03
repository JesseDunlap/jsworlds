/**
 * View
 * Implements the View aspect of the P MVC.
 */

var ViewModule = function(P) {
	P.view = function(view_name, options) {
		if (options === undefined) options = {};

		var viewPath = "";

		if (require('fs').existsSync(view_name)) viewPath = view_name;
		else viewPath = 'app/views/' + global.config.app.localization + '/' + view_name + '.' + P.templatingEngines[global.config.app.templatingEngine].extension;

		var	contents 	= require('fs').readFileSync(viewPath).toString(),
			view_id 	= require('node-uuid').v4();
		
		if (!options)			options = {};
		if (!options.filename) 	options.filename = viewPath;
		
		options.P = P;
		
		var rendered	= "<div id='" + view_id + "'>" + P.templatingEngines[(options.templatingEngine === undefined) ? global.config.app.templatingEngine : options.templatingEngine].helper(contents, options) + "</div>";	
		P.element("body").append(rendered);
		
		return P.element("#" + view_id);
	};
	
	P.snippet = function(view_name, options) {
		if (options === undefined) options = {};
		
		var viewPath = "";

		if (require('fs').existsSync(view_name)) viewPath = view_name;
		else viewPath = 'app/views/' + global.config.app.localization + '/' + view_name + '.' + P.templatingEngines[global.config.app.templatingEngine].extension;

		var	contents 	= require('fs').readFileSync(viewPath).toString(),
			view_id 	= require('node-uuid').v4();
		
		if (!options)			options = {};
		if (!options.filename) 	options.filename = viewPath;
		
		options.P = P;
		
		return P.templatingEngines[(options.templatingEngine === undefined) ? global.config.app.templatingEngine : options.templatingEngine].helper(contents, options);
	};

	if (typeof P.templatingEngines === 'undefined') P.templatingEngines = {};	
};

module.exports = ViewModule;
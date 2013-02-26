/**
 * View
 * Implements the View aspect of the P MVC.
 */

exports.module = function(P) {
	P.view = function(view_name, options) {
		if (options === undefined) options = {};

		var viewPath = "";

		if (require('fs').existsSync(view_name)) viewPath = view_name;
		else viewPath = 'app/views/' + P.config.localization + '/' + view_name + '.' + P.templatingEngines[P.config.templatingEngine].extension;

		var	contents 	= require('fs').readFileSync(viewPath).toString(),
			view_id 	= require('node-uuid').v4();
		
		if (!options)			options = {};
		if (!options.filename) 	options.filename = viewPath;
		
		options.P = P;
		
		var rendered	= "<div id='" + view_id + "'>" + P.templatingEngines[(options.templatingEngine === undefined) ? P.config.templatingEngine : options.templatingEngine].helper(contents, options) + "</div>";	
		P.element("body").append(rendered);
		
		return P.element("#" + view_id);
	};
	
	P.script = function(script_name, options) {
		return "<script type=\"text/javascript\">\n\t" + P.snippet(script_name, options) + "\n</script>";
	};
	
	P.snippet = function(view_name, options) {
		if (options === undefined) options = {};
		
		var viewPath = "";

		if (require('fs').existsSync(view_name)) viewPath = view_name;
		else viewPath = 'app/views/' + P.config.localization + '/' + view_name + '.' + P.templatingEngines[P.config.templatingEngine].extension;

		var	contents 	= require('fs').readFileSync(viewPath).toString(),
			view_id 	= require('node-uuid').v4();
		
		if (!options)			options = {};
		if (!options.filename) 	options.filename = viewPath;
		
		options.P = P;
		
		return P.templatingEngines[(options.templatingEngine === undefined) ? P.config.templatingEngine : options.templatingEngine].helper(contents, options);
	};

	if (typeof P.templatingEngines === 'undefined') P.templatingEngines = {};

	/**
	 * implement the ejs view renderer
	 */
	
	P.templatingEngines["ejs"] = {
		helper: function(contents, options) {
			return require('ejs').render(contents, options);
		},

		extension: "ejs"
	};
	
	/**
	 * implement mustache
	 */
	P.templatingEngines["mustache"] = {
		helper: function(contents, options) {
			return require('mustache').render(contents, options);
		},
		
		extension: "mustache"
	};
	
	/**
	 * implement jade
	 */
	P.templatingEngines["jade"] = {
		helper: function(contents, options) {
			return require('jade').compile(contents, (P.config.jade === undefined) ? {} : P.config.jade)(options);
		},

		extension: "jade"
	};
};
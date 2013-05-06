var EJSModule = function(P) {
	P.dependOn(["View"]);
	
	P.templatingEngines["ejs"] = {
		helper: function(contents, options) {
			options.require = global.require;
			options.fs      = require('fs');
			return require('ejs').render(contents, options);
		},

		extension: "ejs"
	};
};

module.exports = EJSModule;
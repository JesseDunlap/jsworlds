var JadeModule = function(P) {
	P.dependOn(["View"]);
	
	P.templatingEngines["jade"] = {
		helper: function(contents, options) {
			return require('jade').compile(contents, (global.config.app.jade === undefined) ? {} : global.config.app.jade)(options);
		},

		extension: "jade"
	};
};

module.exports = JadeModule;
var MustacheModule = function(P) {
	P.dependOn(["View"]);
	
	P.templatingEngines["mustache"] = {
		helper: function(contents, options) {
			return require('mustache').render(contents, options);
		},
		
		extension: "mustache"
	};
};

module.exports = MustacheModule;
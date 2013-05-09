var PluginController = function(P) {
	this.test = function() {
		P.globalCrafty("0", "test").create().addScript("test.js");
	};
};

module.exports = PluginController;
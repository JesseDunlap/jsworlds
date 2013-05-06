module.exports.setupP = function() {
	/**
	 * P bootstrap file
	 */

	var P					=	require("../../lib/hydrais/p/P.js"),
		io					=	require("socket.io"),
		fs					=	require("fs"),
		wrench				=	require("wrench"),
		connect				=	require("connect");


	/**
	 * Prevent unhandled exceptions from crashing the entire app.
	 */
	process.on('uncaughtException', function (err) {
	    console.error(err);
	    console.trace(err.stack);
	});


	/**
	 * Load all of the configuration files, and add them to a global config
	 * variable, so that they can be used across the app.
	 */

	global.config   = global.config || {};

	var configFiles = fs.readdirSync("config");

	configFiles.forEach(function(configFile) {
		if (fs.statSync("config/" + configFile).isFile() && configFile.substr(0, 1) != ".")
			global.config[configFile.replace(".js", "")] = require("../../config/" + configFile);
	});
	
	var server = new P();
	server.autoloadModules();
	return server;
};

module.exports.copyTemplate = function(template, destination) {
	if (require("fs").existsSync(destination)) require("fs").unlinkSync(destination);
	var contents = require("fs").readFileSync("test/helpers/templates/" + template).toString();
	require("fs").writeFileSync(destination, contents);
};

module.exports.getTemplate = function(template) {
	return require("fs").readFileSync("test/helpers/templates/" + template).toString();
};
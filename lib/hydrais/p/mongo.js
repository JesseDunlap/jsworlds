/**
 * MongoDB
 * Wraps the "mongojs" library, allowing automatic configuration through
 * the "mongodb.js" configuration file. Automatically handles disconnecting
 * from the databases when the user leaves the application.
 */

module.exports = function(P) {
	this.config 			=	global.config.mongodb || {};
	P.dbInstances			=	[];
	
	this.getURL = function() {
		var url = "";
		
		var url = "";
		
		// Username & Password
		if (this.config.username != "" && this.config.password != "")
			url += this.config.username + ":" + this.config.password + "@";
			
		// Host
		url += this.config.host;
		
		// Port
		if (this.config.port != "")
			url += ":" + this.config.port
			
		// DbName
		url += "/" + this.config.database;
		
		return url;
	};
	
	this.configure = function(config) {
		this.config = config;
	};
	
	this.useDefaultConfiguration = function() {
		this.config = global.config.mongodb;
	};
	
	this.connect = function(collections) {
		this.db = require("mongojs").connect(this.getURL(), collections || []);
		P.dbInstances.push(this.db);
		return this.db;
	};
	
	if (P.socket) {
		P.socket.on("finish-disconnect", function() {
			P.dbInstances.forEach(function(db) {
				db.close();
			});
		});
	}
};
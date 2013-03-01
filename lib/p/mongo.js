/**
 * MongoDB
 * A simple MongoDB wrapper that uses mongojs. Requires a configuration
 * that can either be loaded from a JSON file or passed as an object.
 * 
 * CONFIGURATION INFORMATION:
 *
 * 		"host"						The host that the database runs on.
 *									Use "default" to use the default host.
 *
 * 		"port"						The port that the database runs on.
 *									Use "default" to use the default port.
 *
 * 		"username"					The username that should be used to log in to the database.
 *									Leave blank for anonymous or unsecured access.
 *
 *		"password"					The password that should be used to log in to the database.
 *									Leave blank for anonymous or unsecured access.
 *
 * 		"dbname"					The name of the database to use on the server.
 *
 *
 * connect METHOD INFORMATION:
 *
 *		When you use the connect() method, you must specify a list of collections
 * 		that you will be using on the database. This allows mongojs to preload
 * 		them and utilize them.
 *
 *		Example: 		MongoDB.connect(["users", "posts"]);
 *
 *
 * Plasma is released under the Creative Commons Attribution-ShareAlike 2.5 License
 * for more information, please see LICENSE.md
 */


module.exports = function(P)
{
	P._dbInstances = [];
	
	this._getURL = function()
	{
		var url = "";
		
		// Username & Password
		if (this.user != "" && this.pass != "")
			url += this.user + ":" + this.pass + "@";
			
		// Host
		url += this.host;
		
		// Port
		if (this.port != "")
			url += ":" + this.port
			
		// DbName
		url += "/" + this.db;
		
		return url;
	};
	
	this.configure = function(config)
	{
		P.configure({ mongo: config });
	};

	this.connect = function(collections)
	{
		if (P.config.mongo) {
			var config	= P.config.mongo;
			this.host	= (config.host == "default") ? "127.0.0.1" : config.host;
			this.port	= (config.port == "default") ? "" : config.port;
			this.user	= config.username;
			this.pass 	= config.password;
			this.db		= config.dbname;
		}
		
		var newDB = require('mongojs').connect(this._getURL(), collections);
		P._dbInstances.push(newDB);
		return newDB;
	};
	
	P.socket.on("disconnect", function() {
		P._dbInstances.forEach(function(db) {
			db.close();
		});
	});
};
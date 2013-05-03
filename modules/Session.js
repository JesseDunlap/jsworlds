var SessionModule = function(P) {
	/**
	 * Create the data directory if it doesn't already exist
	 */
	 if (!require("fs").existsSync("app/data"))
		require('fs').mkdirSync("app/data");
	
	/**
	 * Handle sessionID emissions
	 */
	if (P.socket) {
		P.socket.on("sessionID", function(data) {		
			if (data == "request") {
				var sessionID = require('sha1')(global.config.app.session.sessionID + "-" + require('node-uuid').v4());
				if (P.socket) P.socket.emit("sessionID", { id: sessionID }); // tell client to save new id
			
				P.sessionFile = "app/data/" + sessionID + ".session.json";
				P.sessionID   = sessionID;
			}
		
			else {
				P.sessionFile = "app/data/" + data + ".session.json";
				P.sessionID   = data;
			
				// The session may have already been deleted, so we will re-use it like a boss!
				if (!require('fs').existsSync(P.sessionFile)) require('fs').writeFileSync(P.sessionFile, "{}");
			}
		
			// Allow the application to continue
			P.emit("ready");
		});
	
		/**
		 * Ask the client for its session ID
		 */
		P.socket.emit("ident", { sessionID: global.config.app.sessionID });
	}
	
	/**
	 * Handle "file" session mode
	 */
	if (global.config.app.session.mode == "file") {
		P.session = function(key, value) {
			var type = "set";
			if (typeof value == 'function') type = "get";
			
			/**
			 * If the session file is invalid, send a false callback
			 * and prevent further execution.
			 */
			if (P.sessionFile === undefined || P.sessionFile == "") {
				value(null);
				return;
			}
			
			if (!require("fs").existsSync(P.sessionFile))
				require("fs").writeFileSync(P.sessionFile, "{}");
			
			/**
			 * Handle session "get" requests
			 */
			if (type == "get") {
				var sessionJSON = JSON.parse(require("fs").readFileSync(P.sessionFile).toString());
				value(sessionJSON[key]);
			}
			
			/**
			 * Handle session "set" requests
			 */
			else if (type == "set") {
				var sessionJSON = JSON.parse(require("fs").readFileSync(P.sessionFile).toString());
				sessionJSON[key] = value;
				require("fs").writeFileSync(P.sessionFile, JSON.stringify(sessionJSON));
			}			
		};
	}
	
	/**
	 * Handle "redis" session mode
	 */
	else {
		var redis 	= require("redis"),
			client	= redis.createClient(
							global.config.app.session.redis.port,
							global.config.app.session.redis.host
						);
		
		client.auth(global.config.app.session.redis.password);
		
		if (P.socket) {
			P.socket.on("disconnect", function() {
				client.end();
			});
		}
		
		P.session =	function(key, value) {
			key = P.sessionID + "-" + key;
			
			if (typeof value !== 'function') {
				client.set(key, value);
			}
			
			else {
				client.get(key, function(err, v) {
					value(v);
				});
			}
		};
	}
};

module.exports = SessionModule;
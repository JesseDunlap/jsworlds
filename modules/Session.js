/**
 * Session
 * Allows a persistent session storage system for your
 * application.
 *
 * Use P.session.get("somekey") to get a value
 * Use P.session.set("somekey", "somevalue") to set a value
 *
 * Values can be any serializable data structure, and they are stored in JSON format.
 */

var config = {
	api_server: 	require('../config/global/api_server'),
	socket_server: 	require('../config/global/socket_server'),
	app: 			require('../config/global/app')
};

exports.module = function(P) {
	if (P.sessionFile === undefined) P.sessionFile = "";
	
	P.session =	function(key, value) {		
		if (P.sessionFile === "") return;
		
		if (value) {
			if (typeof P.sessionFile !== 'undefined') {
				try {
					var json = JSON.parse(require('fs').readFileSync(P.sessionFile).toString());
					json[key] = value;
					require('fs').writeFileSync(P.sessionFile, JSON.stringify(json));
				}
				
				catch (ex) {
					P.log.error(ex);
					return null;
				}
			}
			
			else {
				console.log("This should never happen, but dude. It happened.");
			}
		}
		
		else {
			if (typeof P.sessionFile !== 'undefined') {
				try {
					if (!require('fs').existsSync(P.sessionFile)) require('fs').writeFileSync(P.sessionFile, "{}");
					var json = JSON.parse(require('fs').readFileSync(P.sessionFile).toString());
					return json[key];
				}
				
				catch (ex) {
					P.log.error(ex);
					return null;
				}
			}
		}
	};
	
	P.globalStorage = {};
	
	P.global = function(key, value) {		
		if (value) {
			P.globalStorage[key] = value;
		}
		
		else {
			return P.globalStorage[key];
		}
	}
	
	///////////////////////////////////
	// Make data directory in case it
	// doesn't already exist!
	///////////////////////////////////
	require('fs').mkdir("app/data");
	
	///////////////////////////////////
	// Handle sessionID data
	///////////////////////////////////
	P.on("sessionID", function(data) {
		if (data == "request") {
			// The client requested a session key, so we will generate and send them one
			var sessionID = require('sha1')(config.app.sessionID + "-" + require('node-uuid').v4());
			P.socket.emit("sessionID", { id: sessionID }); // tell client to save new id
			P.sessionFile = "app/data/" + sessionID + ".session.json";
		} 
		
		else {
			if (!require('fs').existsSync("app/data/" + data + ".session.json"))
				require('fs').writeFileSync("app/data/" + data + ".session.json", "{}");
				
			P.sessionFile = "app/data/" + data + ".session.json";
			
			// The session may have already been deleted, so we will re-use it like a boss!
			if (!require('fs').existsSync(P.sessionFile)) require('fs').writeFileSync(P.sessionFile, "{}");
		}
		
		P.controller("app").onLoad(function() {
			P.controller("index").index();
		});
	});
}
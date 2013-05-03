var jw = require("watchvar");

var ClientSyncModule = function(P) {
	P.clients 	= global.clients;
	P.username	= "Anonymous";
	
	jw.watch(P.clients, function() {
		P.emit("clients-changed", P.clients);
	});
};
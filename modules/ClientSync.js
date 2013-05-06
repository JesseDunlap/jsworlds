var jw = require("watchvar");

var ClientSyncModule = function(P) {
	P.clients 	= global.clients;
	P.username	= "Anonymous";
};

module.exports = ClientSyncModule;
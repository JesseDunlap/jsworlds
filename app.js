/**
 * P Bootstrap File
 * Handles incoming connections to the server and dispatches them
 * with a new P instance.
 */

require("node-use");

var PApp		=	require('./lib/p/P');
var cluster		=	require('cluster');

var config = {
	api_server: 	require('./config/global/api_server'),
	socket_server: 	require('./config/global/socket_server'),
    webserver:      require('./config/global/webserver'),
	app: 			require('./config/global/app')
};

if (require('fs').existsSync === undefined)
	require('fs').existsSync = require('path').existsSync;


console.log("======================================================");	
console.log("\033[34mP Framework\033[0m");
console.log("Current Version:\t\t" + "\033[34m" + "\"1.0.0\"" + "\033[0m");
console.log("======================================================\n");

///////////////////////////////////
// Start Socket Server
///////////////////////////////////
var global		= require('./lib/p/global');
var io 			= require('socket.io').listen(config.socket_server.port, config.socket_server.host);
global.io 		= io;

///////////////////////////////////
// Start Connect Web Server (If Configured)
///////////////////////////////////

if (config.webserver.enabled) {
    var connect = require('connect');

	try {
	    connect.createServer(
	        connect.static(__dirname)
	    ).listen(config.webserver.port, config.webserver.host);

	    console.log("\033[34mYour app is live at http://%s:%d/\033[0m", config.webserver.host, config.webserver.port);
	}
	
	catch (e) {
		console.log("[ERROR]\tWeb server could not listen on port %d. The address may already be in use.", config.webserver.port);
		console.log("[ERROR]\t" + e);
	}
}


///////////////////////////////////
// Read and configure socket.io
///////////////////////////////////
for (var key in config.socket_server.socketIO) {
	io.set(key, config.socket_server.socketIO[key]);
}

console.log("Socket server listening at http://%s:%d", config.socket_server.host, config.socket_server.port);

///////////////////////////////////
// Check integrity of sessionID
///////////////////////////////////
if (config.app.sessionID == "change_me") {
	console.log("\u001b[33m==================================================================");
	console.log("    [Warning] You need to change sessionID in config/server.js.");
	console.log("==================================================================\u001b[0m");
}

///////////////////////////////////
// Listen For Connections
///////////////////////////////////
io.sockets.on("connection", function(socket) {
    var P = new PApp(socket);

	// load all modules and configuration
	var configFiles = require('fs').readdirSync("config");
	var moduleFiles = require('fs').readdirSync("modules");
	
	configFiles.forEach(function(configFile) {
		if (configFile != "global" && configFile.substring(0, 1) != ".")
			require('./config/' + configFile)(P);
	});
	
	moduleFiles.forEach(function(moduleFile) {
		if (moduleFile.substr(0, 1) != ".") {
			var loadedModule = require('./modules/' + moduleFile);

			if (loadedModule.autoload !== false)
				loadedModule.module(P);
		}
	});	
	
	// send "ident" emission
	socket.emit("ident", { sessionID: config.app.sessionID });
});

//////////////////////////////////
// initialize command line
//////////////////////////////////

var readline    = require('readline'),
    rl          = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt("$ ");
rl.prompt();

var contents = require('fs').readdirSync("command_modules/");

rl.on("line", function(line) {
    contents.forEach(function(content) {
         var module = new require("./command_modules/" + content)(line.split(" ")[0].trim(), line.split(" "), global.clients);
    });

    rl.prompt();
});

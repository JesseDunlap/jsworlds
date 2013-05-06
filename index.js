module.exports = function() {
	
};

module.exports.prototype.init = function() {
	var P					=	require("./lib/hydrais/p/P.js"),
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
			global.config[configFile.replace(".js", "")] = require("./config/" + configFile);
	});


	/**
	 * Print welcome message
	 */

	console.log("==================================================");
	console.log("Welcome to the P Framework!");
	console.log("You're running version %s", global.config.system.version);
	console.log("==================================================");


	/**
	 * Start a connect webserver instance
	 */

	if (global.config.servers.http.enabled === true) {
		var connectHost = global.config.servers.http.host;
		var connectPort = global.config.servers.http.port;
	
		try {
			global.connectServer = connect.createServer(
				connect.cookieParser(),
				connect.session({ secret: global.config.app.session.sessionID }),
		        connect.static(__dirname)
		    ).listen(global.config.servers.http.port, global.config.servers.http.host);
	
			console.log("App online at http://%s:%d", connectHost, connectPort);
		}
	
		catch (e) {
			console.error(e);
			console.trace(e.stack);
		}
	}

	/**
	 * Check to make sure the sessionID was changed
	 */
	if (global.config.app.session.sessionID == "change_me") {
		console.log("\u001b[33m==================================================================");
		console.log("    [Warning] You need to change sessionID in config/app.js.");
		console.log("==================================================================\u001b[0m");
	}
	
	/**
	 * Start a socket.io server
	 */

	try {	
		io = io.listen(global.connectServer);
	
		if (global.config.servers.socket.setupSocketIO)
			global.config.servers.socket.setupSocketIO(io);
	}

	catch (e) {
		console.error(e);
		console.trace(e.stack);
	}

	/**
	 * Wait for new connections to the socket server.
	 */

	io.sockets.on("connection", function(socket) {
		try {
			var server		=	new P(socket);
		
			/**
			 * Keep track of this server in a global array
			 */
			global.clients = global.clients || [];
			global.clients.push(server);
		
			server.on("disconnect", function() {
				global.clients.splice(global.clients.indexOf(server), 1);
			});
		
			/**
			 * Setup the server
			 */
			server.autoloadModules();
		}
	
		catch (e) {
			console.error(e);
			console.trace(e.stack);
		}
	});
	
	/**
	 * Load Command Modules and handle user console input
	 */
	var commandFiles = require("fs").readdirSync("commands");
	global.commands  = [];
	var commandP     = new P();
	
	commandFiles.forEach(function(file) {
		var command = require("./commands/" + file);
		
		command   = new command(commandP);
		command.P = commandP;
		global.commands.push(command);
	});
	
	var readline    = require('readline'),
	    rl          = readline.createInterface(process.stdin, process.stdout);

	rl.setPrompt("$ ");
	rl.prompt();

	rl.on("line", function(line) {
	    var command = line.split(" ")[0];
		var args	= line.split(" ");
		args.splice(0, 1);
		
		global.commands.forEach(function(c) {
			c.onCommand(command, args);
		});

	    rl.prompt();
	});
};
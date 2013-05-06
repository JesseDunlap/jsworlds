var ClientsCommand = function() {
	
};

ClientsCommand.prototype.onCommand = function(command, args) {
	if (command == "clients") {
		switch(args[0]) {
			case "list":
				global.clients = global.clients || [];
			
				console.log("=================================");
				console.log("Currently Connected Clients (%d)", global.clients.length);
				console.log("=================================");
				console.log("");

				
				for (var i = 0; i < global.clients.length; i++) {
					var client = global.clients[i];
					var username = (client.account === undefined) ? "Unknown" : client.account.firstName + " " + client.account.lastName;
					console.log("  * [" + i + "] " + client.socket.handshake.address.address + " - " + username);
				}
				
				console.log("");
				console.log("=================================");
				break;
			
			case "disconnect":
				global.clients   = global.clients || [];
				var clientNumber = args[1];
				
				if (global.clients.length <= clientNumber) {
					console.error("Invalid client number.");
					return;
				}
				
				global.clients[clientNumber].socket.disconnect();
				
				console.log("Client %d Disconnected.", clientNumber);
				break;
			
			case "message":
				global.clients   = global.clients || [];
				var clientNumber = args[1];
				
				if (global.clients.length <= clientNumber) {
					console.error("Invalid client number.");
					return;
				}
				
				args.splice(0, 2);
				var message = args.join(" ");
				
				var client = global.clients[clientNumber];
				client.$("body").append("<div id='systemMessage' style='position: absolute; top: 0px; left: 0px; z-index: 999; background-color: #000; padding: 10px; color: #fff;'><strong>Message From Server</strong><br />" + message + "</div>");
				
				setTimeout(function() {
					client.$("#systemMessage").remove();
				}, 5000);
				
				break;
				
			case "trigger":
				global.clients   = global.clients || [];
				var clientNumber = args[1];
				
				if (global.clients.length <= clientNumber) {
					console.error("Invalid client number.");
					return;
				}
				
				var controller = args[2];
				var action     = args[3];
				
				global.clients[clientNumber].controller(controller)[action]();
				
				break;
				
			default:
				console.log("Commands: ");
				console.log("  clients list                                Lists all connected clients.");
				console.log("  clients disconnect <#>                      Disconnects a specified client.");
				console.log("  clients message <#> <message>               Sends a system message to a client");
				console.log("  clients trigger <#> <controller> <action>   Forces the specified client to trigger a controller action.");
		};
	}
};

module.exports = ClientsCommand;
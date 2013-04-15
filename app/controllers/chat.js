var MessageType = {
	PUBLIC:		1,
	PRIVATE:	2,
	SYSTEM:		3,
	EMOTE:		4
};

var ChatController = function(P) {
	this.sendMessage = function(message) {
		var sender = P.account.username;
		
		P.clients.forEach(function(client) {
			client.controller("chat").getMessage({
				type: 		MessageType.PUBLIC,
				sender: 	sender,
				message:	message
			});	
		});
	};
	
	this.sendPM = function(data) {
		var sender    = P.account.username;
		var recipient = data.recipient;
		var message   = data.message;
		
		P.clients.forEach(function(client) {
			if (client.account.username == recipient) {
				client.controller("chat").getMessage({
					type: 		MessageType.PRIVATE,
					sender: 	sender,
					message:	message
				});
			}	
		});
	};
	
	this.getMessage = function(data) {
		switch(data.type) {
			// Public Message
			case 1:
				P.$("#messages").prepend(P.snippet("chat/message", {
					color: 		"#FFF",
					sender: 	data.sender,
					message: 	data.message
				}));
				
				break;
			
			// Private Message
			case 2:
				P.$("#messages").prepend(P.snippet("chat/private_message", {
					color: 		"#09F",
					sender: 	data.sender,
					message: 	data.message
				}));
				
				break;
				
			// System Message
			case 3:
				P.$("#messages").prepend(P.snippet("chat/message", {
					color: 		"#F00",
					sender: 	data.sender || "System",
					message: 	data.message
				}));
				
				break;
			
			// Emote Message
			case 4:
				P.$("#messages").prepend(P.snippet("chat/emote_message", {
					color: 		"#FFF",
					sender: 	data.sender,
					message: 	data.message
				}));
				
				break;
			
			default:
				break;
		};
	};
};

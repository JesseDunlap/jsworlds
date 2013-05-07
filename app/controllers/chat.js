var MessageType = {
	PUBLIC:		1,
	PRIVATE:	2,
	SYSTEM:		3,
	EMOTE:		4
};

var ChatController = function(P) {
	this.sendMessage = function(message) {
		var sender = P.account.firstName;
		
		P.clients.forEach(function(client) {
			client.controller("chat").getMessage({
				type: 		MessageType.PUBLIC,
				sender: 	sender,
				message:	message
			});	
		});
	};
	
	this.sendPM = function(data) {
		var sender    = P.account.firstName;
		var recipient = data.recipient;
		var message   = data.message;
		
		P.clients.forEach(function(client) {
			if (client.account.firstName == recipient) {
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
			case MessageType.PUBLIC:
				P.$("#messages").prepend(P.snippet("chat/message", {
					color: 		"#FFF",
					sender: 	data.sender,
					message: 	data.message
				}));
				
				break;
			
			// Private Message
			case MessageType.PRIVATE:
				P.$("#messages").prepend(P.snippet("chat/private_message", {
					color: 		"#09F",
					sender: 	data.sender,
					message: 	data.message
				}));
				
				break;
				
			// System Message
			case MessageType.SYSTEM:
				P.$("#messages").prepend(P.snippet("chat/message", {
					color: 		"#F00",
					sender: 	data.sender || "System",
					message: 	data.message
				}));
				
				break;
			
			// Emote Message
			case MessageType.EMOTE:
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

module.exports = ChatController;

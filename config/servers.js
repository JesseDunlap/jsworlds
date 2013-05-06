module.exports = {
	/**
	 * Socket.IO Server Configuration
	 */
	socket: {		
		// Allows you to configure the socket.io instance
		setupSocketIO: function(io) {
			switch (global.config.app.environment) {
				case "production": 
					io.enable("browser client minification");
					io.enable("browser client etag");
					io.enable("browser client gzip");
					io.set("log level", 1);
					io.set("transports" [
						"websocket",
						"flashsocket",
						"htmlfile",
						"xhr-polling",
						"jsonp-polling"
					]);
					
					break;
					
				default:
					io.set("log level", 1);
					break;
			}
		}
	},
	
	http: {
		// If set to false, this will disable the built in http server, ideally
		// in lieu of apache or nginx.
		enabled: 					true,
		
		// The host to listen on
		host: 						"0.0.0.0",
		
		// The port to listen on (make sure your client.json file matches this!)
		port: 						8888
	}
};
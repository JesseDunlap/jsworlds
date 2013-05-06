var io = require('socket.io-client')

var PApp = function() {
	var	$this			=	this;
	$this.socket		=	undefined;
	$this.events		=	{};
	$this.configuration	=	{};
	$this.controllers	=	{};

	/**
	 * session
	 * Gets or sets a session variable either using localStorage
	 * or falling back to cookies
	 */
	$this.session = function(key, value) {
		$this.localStorage = $this.localStorage || {};
		
		if (value) {
			$this.localStorage[key] = value;
		}
		
		else {
			return $this.localStorage[key];
		}
	};
	
	
	/**
	 * stringReplace
	 * Replaces a string with another string THE RIGHT WAY
	 * (replacing all occurances)
	 */
	$this.stringReplace = function(src, find, replace) {
		while (src.replace(find, replace) != src)
			src = src.replace(find, replace);

		return src;
	};
	
	
	/**
	 * connect
	 * initializes a connection to a new P server.
	 * You may specify configuration for the connection
	 * directly in the connect call, otherwise P will
	 * attempt to use whatever configuration has already
	 * been set.
	 */
	$this.connect = function(config) {
		$this.configuration = { connection: config };
		$this.socket = io.connect("http://" + $this.configuration.connection.host + ":" + $this.configuration.connection.port);
		$this.setupSocket();
	};
	
	/**
	 * setupSocket
	 * Sets up various events with the socket. This should
	 * only be called internally in the connect method...
	 */
	$this.setupSocket = function() {
		$this.on("ident", function(data) {
			$this.emit("sessionID", P.sessionID);
		});
		
		$this.on("sessionID", function(data) {
			$this.session("p-session-" + $this.sessionID, data.id);
		});
		
		$this.socket.on("controllers", function(controllers) {
			for (var controllerName in controllers) {
				var controller = controllers[controllerName];
				
				$this.controllers[controllerName] = {};
				
				
				controller.forEach(function(actionName) {
					(function(controller, action) {
						$this.controllers[controller][action] = function(args, callback) {
							$this.controller(controller, action, args, callback);
						};
					})(controllerName, actionName);
				});
			}
		});
	};
	
	
	/**
	 * controller
	 * Mimics the controller function on the server side,
	 * allowing you to call controller methods.
	 */
	$this.controller = function(controller_name, action, data, callback) {
		if (typeof data === 'function') callback = data;
		
		if (action) {
			if (callback !== undefined) {
				var callbackID = Math.random(99999999);
				$this.socket.on(callbackID, callback);
				$this.emit("call", { controller: controller_name, action: action, data: data, _callback: callbackID });
			}
			else
				$this.emit("call", { controller: controller_name, action: action, data: data });
		}
		
		else {
			if ($this.controllers[controller_name]) return $this.controllers[controller_name];
			else console.warn("No such controller: " + controller_name);
		}
	};
	
	
	/**
	 * on
	 * Adds an event handler for a socket emitter as well as
	 * a local plasma emitter and sends the callback if it
	 * happens.
	 */
	$this.on = function(listener, callback) {
		if ($this.events[listener] === undefined) $this.events[listener] = [];
		$this.events[listener].push(callback);
		
		if ($this.socket) $this.socket.on(listener, callback);
	};
	
	/**
	 * emit
	 * Calls a local plasma event and emits across the socket
	 * to the server.
	 */
	$this.emit = function(listener, data) {
		if ($this.events[listener]) {
			$this.events[listener].forEach(function(cb) { cb(data); });
		}
		
		if ($this.socket && data.socket !== false)
			$this.socket.emit(listener, data);
	};
};


module.exports = function(P) {
	P.getAppBridge = function() { return new PApp(); };
	
	P.connectToApp = function(host, port) {
		var app = new PApp();
		app.connect({ host: host, port: port });
		return app;
	};
};
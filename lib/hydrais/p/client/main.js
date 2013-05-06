/**
 * Implements the connection and interaction protocols outlined in the P Framework
 * client specification. In essence, this file represents the client-side nature of
 * the P Framework, which is bundled by default. In reality, this is simply a client
 * implementation of a P Client in JavaScript. This component could be swapped out
 * with any client implementation, in any language.
 *
 * P Framework Client Specification
 * http://goo.gl/28Ujq
 */


var PClient = function() {
	this.events         =   {};
	this.configuration  =   {};
	this.controllers    =   {};
	this.emitters       =   {};
};

/**
 * Adds an event listener for a specified emitter.
 *
 * @param emitter                   The emission "channel" to listen on.
 * @param callback                  The callback function, which will be triggered when an emission occurs
 *                                  on the emission channel.
 */
PClient.prototype.on = function(emitter, callback) {
	this.emitters[emitter] = this.emitters[emitter] || [];
	this.emitters[emitter].push(callback);

	if (this.socket)
		this.socket.on(emitter, callback);
};

/**
 * Removes all, or optionally one event listener from the emission channel.
 *
 * @param emitter                   The emission channel to stop listening on. Note: If a callback function
 *                                  is not passed as the second parameter, EVERY listener will be removed.
 *
 * @param [callback]                Optional callback filter. If set, ONLY this callback will be deregistered.
 */
PClient.prototype.off = function(emitter, callback) {
	if (callback === undefined) {
		this.emitters[emitter] = [];
	}

	else {
		if (this.emitters[emitter].indexOf(callback) !== -1)
			delete this.emitters[emitter][this.emitters[emitter].indexOf(callback)];
	}

	if (this.socket)
		this.socket.off(emitter, callback);
};

/**
 * Sends an emission with optional data to all registered listeners.
 *
 * @param emitter                   The emission channel to broadcast on.
 * @param [data]                    Any serializable data structure, which will be passed along to the listeners.
 */
PClient.prototype.emit = function(emitter, data) {
	this.emitters[emitter] = this.emitters[emitter] || [];

	this.emitters[emitter].forEach(function(e) {
		e(data);
	});

	if (this.socket)
		this.socket.emit(emitter, data);
};

/**
 * When given a data uri, this function returns a "blob"
 * data type representing the supplied data uri.
 *
 * @param dataUri       The data uri to convert.
 */
PClient.prototype.convertDataUriToBlob = function(dataUri) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var bb = new BlobBuilder();
	bb.append(ab);
	return bb.getBlob(mimeString);
};

/**
 * Gets or sets a cookie in the browsers cookie storage depending
 * on whether or not a second or third parameter are specified.
 *
 * @param c_name            The name of the cookie to get (or set).
 * @param [c_value]         The value of the new cookie.
 * @param [ex_days]         The number of days to wait before the cookie expires.
 */

PClient.prototype.cookie = function(c_name, c_value, ex_days) {
	if (c_value) {
		if (!ex_days) ex_days = 1;
		
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}
	
	else {
		var i,x,y,ARRcookies=document.cookie.split(";");
		
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name)
			{
				return unescape(y);
			}
		}
	}
};

/**
 * Gets or sets a session variable in the browser's localStorage system
 * depending on whether or not a second parameter is specified. This
 * system will fallback to cookie storage if localStorage is not available.
 * Cookies will not have an expiry date.
 *
 * @param key               The key in localStorage to get (or set).
 * @param value             The value to assign to the key in localStorage.
 */

PClient.prototype.session = function(key, value) {
	if (typeof localStorage === 'undefined') {
		this.cookie(key, value);
	}

	else {
		if (value) {
			localStorage[key] = value;
		}

		else {
			return localStorage[key];
		}
	}
};

/**
 * Commences the connection process to a specified P Framework server 
 * via Socket.io.
 *
 * @param config                The connection configuration, which should look like this:
 *                              { host: "127.0.0.1", port: 8080 }
 */

 PClient.prototype.connect = function(config) {
	this.configuration.server = this.configuration.server || config;
	this.socket = io.connect("http://" + this.configuration.server.host + ":" + this.configuration.server.port + "/");
	this.setupSocket();
 };

 /**
  * Sets up the newly connected socket, listening for all default emissions,
  * and handling session authentication.
  */

 PClient.prototype.setupSocket = function() {
	var $this = this;

	if (typeof this.socket === 'undefined') throw "Socket setup failed. socket is undefined.";

	/***************************************************************************
	 * Server Authentication & Registration
	 **************************************************************************/

	/**
	 * Handling "ident" emission, which is requested by the server
	 * upon a successful and stable connection. The client is expected
	 * to either send back a saved session key, or request a new one.
	 */
	this.on("ident", function(data) {
		$this.sessionID = data.sessionID;

		if ($this.session("p-session-" + $this.sessionID))
			$this.emit("sessionID", $this.session("p-session-" + $this.sessionID));
		else
			$this.emit("sessionID", "request");
	});

	/**
	 * Handeling the "sessionID" emission, which is sent by the server if the
	 * client request a session ID. The session ID should be stored in some
	 * re-loadable way for future connections.
	 */

	this.on("sessionID", function(data) {
		$this.session("p-session-" + $this.sessionID, data.id);
	});

	/***************************************************************************
	 * Connection Events
	 **************************************************************************/
	 
	/**
	 * Handeling the "connect" emission, which is triggered upon a successful
	 * connection to the server.
	 */
	this.on("connect", function() {
		$("#p").fadeOut();
		$("#p > #message").fadeOut();
	});

	/**
	 * Handeling the "disconnect" emission, which is triggered upon a failed or
	 * interrupted connection to the server.
	 */
	this.on("disconnect", function() {
		$("#p").fadeIn();
		$("#p > #message").html("reconnecting").fadeIn();
	});

	/***************************************************************************
	 * Client-server Bridge Events
	 **************************************************************************/

	 /**
	  * Handeling the "controllers" emission, which specifies the various controllers
	  * and their available actions to the client.
	  */
	this.on("controllers", function(controllers) {
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
	
	/**
	 * Handeling the "setTitle" emission, which is sent by the server when
	 * the PClient.title function is utilized to set the page's title.
	 */
	this.on("setTitle", function(title) {
		document.title = title;
	});

	/**
	 * Handeling the "jq" emission, which is called by the server to simulate
	 * jQuery calls.
	 */
	this.on("jq", function(data) {
		var $this = this;

		if (data.type == "call") {
			// Get a jQuery selector instance
			var selector = $(data.selector);

			// Apply the arguments to the selector
			if (typeof data.method !== 'undefined'
				&& typeof selector !== 'undefined'
				&& typeof data.args !== 'undefined'
				&& data.args[0] !== null) {
				$.fn[data.method].apply(selector, data.args);
			}

			// Reset p:link and p:action
			$('[p\\:action]').off("submit");
			$('[p\\:link]').off("click");

			// Implement p:link and p:action handlers
			$('[p\\:action]').on("submit", function(e) {
				e.preventDefault();
				
				var qs          = $(this).serializeArray(),
					serialized  = {};
				
				qs.forEach(function(keyValue) {
					serialized[keyValue.name] = keyValue.value
				});
				
				var $form           = $(this);
				var fileElements    = [];
				var allFiles        = [];
				
				function processFileInput(fileInputNum) {
					var fileElement = fileElements[fileInputNum].get(0);
				
					for (var i = 0; i < fileElement.files.length; i++) {
						var reader      = new FileReader();
						var filename    = fileElement.files[i].name;

						// Closure to capture the file information.
						reader.onload = (function(i, fileName, total) {                                     
							return function(file) {
								allFiles.push({ name: fileName, contents: file.target.result });
							
								if (i + 1 == fileElement.files.length) {
									if (fileInputNum + 1 == fileElements.length) {
										serialized[fileElements[fileInputNum].attr("name")] = allFiles;
										
										var parts = $form.attr('p:action').split(".");
										$this.controller(parts[0], parts[1], serialized);
									}
									
									else {
										serialized[fileElements[fileInputNum].attr("name")] = allFiles;
										processFileInput(fileInputNum++);
									}
								}                                           
							};
						})(i, filename, fileElement.files.length);
					
						// Read in the image file as a data URL.
						reader.readAsDataURL(fileElement.files[i]); 
					}
				}
				
				$(this).find("input").each(function() {
					if ($(this).attr("type") == "file") {
						if ($(this).get(0).files.length > 0)
							fileElements.push($(this));
					}
				});
				
				if (fileElements.length > 0) {
					processFileInput(0)
				}
				
				else {
					var parts = $(this).attr('p:action').split(".");
					P.controller(parts[0], parts[1], serialized);
				}
			});

			$('[p\\:link]').on("click", function() {
				var parts = $(this).attr('p:link').split(".");
				
				if (parts.length == 2) {
					P.controller(parts[0], parts[1]);
				}

				else if (parts.length > 2) {
					P.controller(parts[0], parts[1], JSON.parse(parts[2]));
				}
			});
		}
	});

	/** 
	 * Handeling the "hashchange" emission, which allows the server to
	 * change the "url" to the page.
	 */
	this.on("hashchange", function(hash) {
		window.ignoreNextHashChange = true;
			
		if (hash.substr(0, 1) != "#")
			window.location.hash = "#" + hash;
		else
			window.location.hash = hash;
	});
 };


 /**
  * Sets up all client-side javascript and event listening
  */
PClient.prototype.setupClient = function() {
	/**
	 * Handeling the "hashchange" event, which lets us transmit a new URL
	 * to the server.
	 */
	$(window).on("hashchange", function() {
		if (window.location.hash == "#" || window.location.hash == "") return;

		var hash = window.location.hash;
		hash     = hash.substring(1); // Remove leading "#"

		var parts       = hash.split("/"),
			controller  = "",
			action      = "",
			params      = [];

		controller      = parts[0];
		parts.splice(0, 1); // Remove controller

		if (parts.length > 0) {
			action = parts[0];
			parts.splice(0, 1); // Remove action

			if (parts.length > 0) params = parts;
		}

		$this.socket.emit("hashchange", {
			hash:           window.location.hash,
			controller:     controller,
			action:         action,
			params:         params
		});
	});

	$(window).trigger("hashchange");
};

/**
 * Mimics the controller function on the server side, allowing you to call
 * controller actions in the events that p:link and p:action won't work.
 *
 * @param controller_name                   The name of the controller to access
 * @param action                            The action to trigger
 * @param [data]                            Additional data to send to the controller action.
 * @param [callback]                        If the action returns a value, this callback
 *                                          will be triggered with the return value as the first
 *                                          parameter.
 */
PClient.prototype.controller = function(controller_name, action, data, callback) {
	var $this = this;

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
 * Nodejs module support, although I can't see why you'd need this.
 */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = PClient;
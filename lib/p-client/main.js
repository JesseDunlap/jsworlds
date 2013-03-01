/**
 * p client
 * Allows connections to a P app server and implements various helper functions for
 * views, including linking to controller actions, and processing form data and file
 * uploads.
 * 
 * P is released under the MIT license. For more information, see LICENSE.md
 */



function dig( blob, depth, callback ) { 
  var depth = depth || 0; // start at level zero
  for( var item in blob ) {
	callback(item)
    if( typeof blob[item] === 'object' ) {
      dig( blob[item], ++depth ); // descend
    } else { // simple value, leaf
		callback(item);
    }
  }
}



/**
 * P
 * main function/object for plasma, initialize it with a jQuery
 * selector, and the app will be contained in that selector.
 * specify a variable if you have multiple plasma apps with different
 * variables. Your variable should match whatever you assign the
 * new instance to.
 */
var P = function(container, variable) {
	var	$this			=	this;
	$this.container		=	container;
	$this.variable		=	variable;
	$this.socket		=	undefined;
	$this.events		=	{};
	$this.configuration	=	{};
	$this.controllers	=	{};
	
	$this.dataURItoBlob = function(dataURI) {
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
	 * cookie
	 * Gets or sets a cookie.
	 *
	 * To get a cookie: P.cookie("some_key");
	 * To set a cookie: P.cookie("some_key", "some_value");
 	 * To set a cookie with a custom expiration date: P.cookie("some_key", "some_value", int_number_of_days);
 	 * (Default expiration date is 1 day)
 	 */
	$this.cookie = function(c_name, c_value, ex_days) {
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
	 * session
	 * Gets or sets a session variable either using localStorage
	 * or falling back to cookies
	 */
	$this.session = function(key, value) {
		if (value) {
			if (localStorage !== undefined) localStorage[key] = value;
			else $this.cookie(key, value, 30);
		}
		
		else {
			if (localStorage !== undefined) return localStorage[key];
			else return $this.cookiet(key);
		}
	};

	
	/**
	 * config
	 * Merges the P config with the config object you specify
	 */
	$this.config = function(config) {
		$.extend($this.configuration, config);
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
		if (config) $this.config({ connection: config });
		
		if ($this.configuration.connection && $this.configuration.connection.host && $this.configuration.connection.port) {
			try {
				$this.socket = io.connect("http://" + $this.configuration.connection.host + ":" + $this.configuration.connection.port);
				$this.setupSocket();
			}
			
			catch (ex) {
				
			}
		}
		
		else {
			$this.log.error("Invalid connection information or connection information not found.");
			$this.log.raw($this.configuration);
		}
	};
	
	/**
	 * setupSocket
	 * Sets up various events with the socket. This should
	 * only be called internally in the connect method...
	 */
	$this.setupSocket = function() {
		$this.on("ident", function(data) {
			$this.sessionID = data.sessionID;
			
			if ($this.session("p-session-" + $this.sessionID))
				$this.emit("sessionID", $this.session("p-session-" + $this.sessionID));
			else
				$this.emit("sessionID", "request");
		});
		
		$this.on("connect", function() {
			$this.container.fadeIn();
			$('#p').fadeOut();
			$('#p > #message').fadeOut();
		});
		
		$this.on('error', function () {
			$this.container.fadeOut();
			$('#p').fadeIn();
			$('#p > #message').html("trying to connect").fadeIn();
		});
		
		$this.on("disconnect", function() {
			$this.container.fadeOut();
			$('#p').fadeIn();
			$('#p > #message').html("please stand by").fadeIn();
		});

		$this.on("reconnecting", function() {
			$this.container.fadeOut();
			$('#p').fadeIn();
			$('#p > #message').html("reconnecting").fadeIn();
		});
		
		
		$this.on("sessionID", function(data) {
			$this.session("p-session-" + $this.sessionID, data.id);
		});
		
		$this.on("setTitle", function(title) {
			document.title = title;
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
		
		$this.on("jq", function(data) {
			switch (data.type) {
				case "call":
					// Filter "body" selections and "container" selections
					// to the app's container.
					var selector;
					
					if ((data.selector == 'body' && data.forceAllowBody != true) || data.selector == 'container') 
						selector = $this.container;
					
					else 
						selector = $(data.selector);

					// Loop through all arguments and filter out occurances of "P."
					// replacing it with the proper variable.
					for (var key in data.args) {
						if (typeof data.args[key] === 'string')
							data.args[key] = $this.stringReplace(data.args[key], "P.", $this.variable + ".");
					}
					
					// Apply the arguments to the selector
					$.fn[data.method].apply(selector, data.args);
					
					// Reset Some Stuff
					$('[p\\:action]').off("submit");
					
					$('[p\\:action]').on("submit", function(e) {
						e.preventDefault();
						
						var qs			= $(this).serializeArray(),
							serialized 	= {};
						
						qs.forEach(function(keyValue) {
							serialized[keyValue.name] = keyValue.value
						});
						
						var $form 			= $(this);
						var fileElements 	= [];
						var allFiles    	= [];
						
						function processFileInput(fileInputNum) {
							var fileElement = fileElements[fileInputNum].get(0);
						
							for (var i = 0; i < fileElement.files.length; i++) {
								var reader 		= new FileReader();
								var filename 	= fileElement.files[i].name;

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
							$this.controller(parts[0], parts[1], serialized);
						}
					});
					
					$('[p\\:link]').off("click");
					
					$('[p\\:link]').on("click", function() {
						var parts = $(this).attr('p:link').split(".");
						$this.controller(parts[0], parts[1]);
					});
					break;
					
				case "on":
					// Filter "body" selections and "container" selections
					// to the app's container.
					var selector;
				
					if ((data.selector == 'body' && data.forceAllowBody != true) || data.selector == 'container') 
						selector = $this.container;
				
					else 
						selector = $(data.selector);
						
					selector.on(data.event, function(e) {
						$this.emit(data.callback);
					});
					
					break;
					
				default:
					$this.log.warning("The server sent an invalid jq calltype.");
					break;
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
	
	
	/**
	 * log
	 * Implements the three main log types:
	 * Notice, Warning, and Error
	 * to mimic the server-side P api
	 */
	$this.log = {
		error: 	function(message, options) {
			console.error("[ERROR]\t" + message);
		},
		
		notice: function(message, options) {
			console.log("[NOTICE]\t" + message);
		},
		
		warning: function(message, options) {
			console.warn("[WARNING]\t" + message);
		},
		
		raw: function(message) {
			console.log(message);
		}
	};

};
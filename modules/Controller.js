/**
 * Controller
 * Implements the Controller aspect of the P MVC.
 */

exports.module = function(P) {
	var $this				=	this;
	P.controllers 			= 	{};								// Cached controllers list
	P.controllerContents	=	{};
	
	P.depends(["Debugger"]);
	
	/** 
	 * Get a list of all controllers and their
	 * actions, so that it can be sent to the client
	 * for easy usage.
	 */
	var controllerFiles = require('fs').readdirSync("app/controllers");
	var _controllers    = {};
	
	controllerFiles.forEach(function(file) {
		var controllerName	=	file.replace(".js", "");
		var controller		=	require("../app/controllers/" + file);
		var instance		=	new controller(P);
		
		_controllers[controllerName] = [];
		
		for (var key in instance) {
			if (typeof instance[key] == "function")
				_controllers[controllerName].push(key);
		}
	});
	
	P.socket.emit("controllers", _controllers);	
	
	
	P.controller = function(controller_name, options) {
        if (options === undefined) options = {};

		if (require('fs').existsSync("app/controllers/" + controller_name + ".js")) {
			var absolutePath = "app/controllers/" + controller_name + ".js";
			var requirePath  = "../app/controllers/" + controller_name + ".js";
		}
		
		else {
			var absolutePath = controller_name;
			var requirePath  = "../" + controller_name;
		}


       	var contents 		= require('fs').readFileSync(absolutePath).toString();
        var savedContents	= (P.controllerContents[controller_name] === undefined) ? "" : P.controllerContents[controller_name];

        if (contents != savedContents) {
        	for (var key in require.cache) {
        		var cache = require.cache[key];
        		cache.filename = cache.filename.replace(/\\/g, "/");

        		if (cache.filename.replace(absolutePath, "") != cache.filename) {
        			delete require.cache[key];
        			delete P.controllers[controller_name];
        		}
        	}
        }

        P.controllerContents[controller_name] = contents;

		/**
		 * if we aren't loading the app controller, call the app controller's
		 * beforeFilter method.
		 */
		if (controller_name !== "app") {
			P.controller("app").beforeFilter(controller_name, options);
		}

        if (P.controllers[controller_name] && options.cache !== false) {
			if (P.controllers[controller_name].beforeFilter) 
				P.controllers[controller_name].beforeFilter();
            return P.controllers[controller_name];
		}
		
		/**
		 * check if the controller exists. if it exists, load it and return a new
		 * instance of it, otherwise throw an error and fail gracefully
		 */	
		if (require('fs').existsSync(absolutePath)) {
			var Controller = require(requirePath);
			var instance   = new Controller(P);
			
			instance._id   = require("node-uuid").v4();
			if (options.cache !== false) P.controllers[controller_name] = instance;
			
			if (instance.beforeFilter) instance.beforeFilter();
			
			return instance;
		}
		
		else {
			P.log.error(controller_name + " is not a valid controller. \"" + absolutePath + "\" could not be found.");
		}
	};

	P.socket.on("disconnect", function(data) {
		if (P.db && P.db.close) P.db.close();
		
		var appController = P.controller("app");
		if (appController.onExit) appController.onExit();
	});
	
	P.socket.on("call", function(data) {		
		var controller = P.controller(data.controller);
		
		if (controller && controller[data.action]) {
			var returnValue = controller[data.action](data.data);
			if (data._callback !== undefined) P.socket.emit(data._callback, returnValue);
		}
	});
};
var fs = require("fs");

var P = function(socket) {
	this.config					=	{};
	this.abilities				=	{};
	this.emitters				=	{};
	this.socket					=	socket;
	this.loadedModules			=	[];
};

/**
 * A special type of emitter, which is treated as a high priority message
 * usually signifying that something has gone wrong. Utilized by the
 * Platform system as an error report, or for notable messages.
 * 
 * distress emissions get sent along the normal emission pipline with
 * "distress-" appended to the specified emission name, as well as
 * through the "distress" emission, which provides the emission name
 * along with the data you supply.
 *
 * @param		name			The name of the emission you wish to send.
 * 
 * @param		data			An optional message, or non-circular structure to send
 *								along with your distress emission.
 *
 */
P.prototype.distress = function(name, data) {
	P.emit("distress-" + name, data);
	P.emit("distress", { emitter: name, data: data });
};

/**
 * Manually loads a module, initializing it and calling it with this as
 * its only parameter. Will not load a module if it has already been loaded,
 * unless forceReload is set to true.
 *
 * @param		name			The name of the module. This should correspond
 *								to a .js file in the "modules" directory.
 *								Note: this can also be a list of modules.
 *
 * @param		forceReload		Optional. If set to true, the module will be
 *								reloaded despite if it has already been loaded
 *								previously. Before using require(), the corresponding
 *								cache will be deleted.
 */
P.prototype.dependOn = function(name, forceReload) {
	var $this = this;
	
	modules = (typeof name === 'string') ? [name] : name;
	forceReload = forceReload || false;
	
	modules.forEach(function(module) {
		if ($this.loadedModules.indexOf(module) === -1 || forceReload === true) {
			if (fs.existsSync("modules/" + module + ".js")) {
				var moduleInstance = require("../../../modules/" + module + ".js");
			
				if (moduleInstance !== undefined && typeof moduleInstance === 'function') {
					moduleInstance($this);
				
					if ($this.loadedModules.indexOf(module) === -1)
						$this.loadedModules.push(module)
				}
			
				else {
					throw "Invalid module: \"" + module + "\". The module exists, but is invalid.";
				}
			}
		
			else {
				throw "Invalid module name: \"" + module + "\". Did you accidentally include \".js\" at the end?";
			}
		}
	});
};


/**
 * Loads all modules, unless they have an autoload attribute which
 * is set to false
 */
P.prototype.autoloadModules = function() {
	var $this = this;
	var moduleFiles	= fs.readdirSync("modules");
	
	moduleFiles.forEach(function(moduleFile) {
		if (moduleFile.substr(0, 1) != ".") {
			if (fs.statSync("modules/" + moduleFile).isFile()) {
				var module = require("../../../modules/" + moduleFile);
				
				if (module !== undefined && typeof module === 'function') {
					if (module.autoload !== false) {
						$this.dependOn(moduleFile.replace(".js", ""));
					}
				}
			}
		}
	});	
};


/****************************************************************
 * Configuration System
 * Provides P.get and P.set, which can be used for app-wide
 * configuration purposes.
 ***************************************************************/

/**
 * Gets a configuration value.
 *
 * @param key 				The key to fetch from the config object.
 */
P.prototype.get = function(key) {
	return this.config[key];
};


/**
 * Sets a configuration value.
 *
 * @param key				The key to set in the config object.
 * @param value				The value to assign to the key in the config.
 */
P.prototype.set = function(key, value) {
	this.config[key] = value;
	return this;
};

/**
 * Sets a default configuration value if the config key hasn't been set.
 *
 * @param key 				The key to set.
 * @param value				The value to set.
 */
P.prototype.setDefault = function(key, value) {
	if (!this.configSet(key)) this.set(key, value);
	return this;
};

/**
 * Returns true if the config value has been previously set
 * or false if the config value is undefined.
 */
P.prototype.configSet = function(key) {
	return (this.config[key] === undefined);
};


/**
 * Allows environment-specific configuration by sending a callback
 * if and only if process.env.NODE_ENV is equal to the specified
 * environment. (If no environment is specified, the callback will)
 * always be triggered.
 *
 * @param [environment]		The desired environment to filter.
 *							Leave blank for all environment config.
 *
 * @param callback 			The callback which should configure
 *							the provided application.
 */
P.prototype.configure = function(environment, callback) {
	if (typeof environment === 'function') {
		callback    = environment;
		environment = process.env.NODE_ENV;
	}

	if (process.env.NODE_ENV === environment) callback(this);

	return this;
};


/****************************************************************
 * Middleware System
 * Provides P.use, which can be utilized with Middleware
 * componenents that can extend the functionality of the app.
 ***************************************************************/

/**
 * Uses a Middleware, passing the supplied callback the "this"
 * keyword, thereby allowing the Middleware to extend the core
 * foundation of the application.
 *
 * @param callback			The callback function which takes a single
 *							parameter, representing the current app.
 */
P.prototype.use = function(callback) {
	if (callback) callback(this);
	return this;
};


/**
 * Allows for an easier extension system, and essentially merges
 * all members from the specified object into the current app's
 * prototype.
 *
 * @param merge 			The object to merge.
 */
P.prototype.extend = function(merge) {
	for (var key in merge) {
		this.prototype[key] = merge[key];
	}
};


/****************************************************************
 * Ability System
 * Provides P.enable, P.disable, and P.enabled, which allow
 * different parts of the app to check if features should be
 * enabled.
 ***************************************************************/

/**
 * Enables an ability.
 *
 * @param ability 			The name of the ability to enable.
 */
P.prototype.enable = function(ability) {
	this.abilities[ability] = true;
	return this;
};

/**
 * Disables an ability.
 *
 * @param ability 			The name of the ability to disable.
 */
P.prototype.disable = function(ability) {
	this.abilities[ability] = false;
	return this;
};

/**
 * Uses a default value for an ability if it hasn't already been set.
 *
 * @param ability 			The name of the ability to check.
 * @param value 			True if enabled, False if disabled.
 */
P.prototype.defaultAbility = function(ability, value) {
	if (!this.abilitySet(ability)) this.abilities[a] = value;
	return this;
};

/**
 * Checks if an ability has been enabled or disabled. Returns true
 * if the ability has not been changed, or false if it has been changed.
 *
 * @param ability 			The name of the ability to check.
 */
P.prototype.abilitySet = function(ability) {
	return (this.abilities[ability] === undefined);
};

/**
 * Checks if an ability is enabled, returning true if enabled, and
 * false if disabled.
 *
 * @param ability 			The name of the ability to check.
 */
P.prototype.enabled = function(ability) {
	return (this.abilities[ability] === true);
};

/**
 * Checks if an ability is disabled, returning true if disabled, and
 * false if enabled.
 *
 * @param ability 			The name of the ability to check.
 */
P.prototype.disabled = function(ability) {
	return (this.abilities[ability] === false);
};


/****************************************************************
 * Emitters System
 * Provides P.on, P.off, and P.emit, which implement an
 * emitters system, allowing the app to pass around data in an
 * evented manner.
 ***************************************************************/

/**
 * Adds an event listener for a specific emitter.
 *
 * @param emitter 			The event to listen for.
 * @param callback 			Triggered when the event is fired.
 */
P.prototype.on = function(emitter, callback) {
	this.emitters[emitter] = this.emitters[emitter] || [];
	this.emitters[emitter].push(callback);
	if (this.socket !== undefined) this.socket.on(emitter, callback);
	return this;
};

/**
 * Removes all or a specific listener from an emitter.
 *
 * @param emitter 			The emitter to remove listeners from.
 * @param [callback] 		An optional specific callback to remove.
 */
P.prototype.off = function(emitter, callback) {
	this.emitters[emitter] = this.emitters[emitter] || [];

	if (typeof callback !== 'undefined') {
		var index = this.emitters[emitter].indexOf(callback);
		if (index !== -1) this.emitters.splice(index, 1);
	}

	else {
		this.emitter[emitter] = [];
	}

	if (this.socket !== undefined) this.socket.off(emitter, callback);

	return this;
};

/**
 * Fires an emitter.
 *
 * @param emitter 			The emitter to file.
 * @param [data] 			An optional data parameter to send to the
 *							associated listeners.
 */
P.prototype.emit = function(emitter, data) {
	this.emitters[emitter] = this.emitters[emitter] || [];

	this.emitters[emitter].forEach(function(callback) {
		callback(data);
	});

	if (this.socket !== undefined) this.socket.emit(emitter, data);
};

/**
 * Schedules an emission for a future date. Returns a node-schedule job,
 * which can be used with P.cancel to abort the emission.
 *
 * @param date 				The date on which to trigger the emission.
 * @param emitter 			The emitter to be triggered.
 * @param data 				Optional data to be sent with the emitter.
 */
P.prototype.schedule = function(date, emitter, data) {
	var time = new Date(date).getTime() - (new Date()).getTime();

	return setTimeout(function() {
		app.emit(emitter, data);
	}, time);
};

/**
 * Cancels a future scheduled emission.
 *
 * @param job 				The scheduled job provided by P.schedule
 */
P.prototype.cancel = function(job) {
	clearTimeout(job);
};


module.exports = P;
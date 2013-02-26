/**
 * Sandbox
 * Wraps the node "vm" library, allowing for safe execution of potentially
 * unsafe code in a sandboxed environment.
 */

var vm = require('vm');

var Sandbox = function(config) {
	var $this		=	this;

	this.config		=	config || {};
	this.global		=	{};
	this.code		=	"";
	this.libs		=	[];

	this.global.require = function(lib) {
		if ($this.libs.indexOf(lib) != -1) return require(lib);
		else if (this.config.logLevel == "all") console.warn("Sandboxed code tried to use unauthorized library: " + lib);
	};
};

Sandbox.prototype.addGlobals = function(globals) {
	if (typeof globals === 'object') {
		for (var key in globals)
			this.global[key] = globals[key];
	}

	else {
		var $this = this;

		globals.forEach(function(global) {
			for (var key in global)
				$this.global[key] = global[key];
		})
	}
};

Sandbox.prototype.allowAllLibraries = function() {
	this.global.require = require;
}

Sandbox.prototype.allowLibrary = function(lib) {
	this.libs.push(lib);
};

Sandbox.prototype.run = function() {
	try {
		var script = vm.createScript(this.code)
		return script.runInNewContext(this.global);
	}
	
	catch (e) {
		return e;
	}
};

Sandbox.prototype.setCode = function(code) {
	this.code = code;
};


module.exports = Sandbox;

module.exports.Globals = {
	Basics: {
		console: 		global.console,
		setInterval: 	global.setInterval,
		setTimeout: 	global.setTimeout	
	}
};
var Crafty = function(selector, P, global) {
	this.global = global || false;
	this.scripts = [];
	this.selector = selector;
	this.P = P;

	this.create = function() {
		if (this.global) {
			P.clients.forEach(function(client) {
				client.socket.emit("crafty-create", { selector: selector });	
			});
		}

		else {
			P.socket.emit("crafty-create", { selector: selector });
		}

		this.scripts.forEach(function(script) {
			if (script.onCreate) script.onCreate();
		});

		return this;
	};

	this.destroy = function() {
		if (this.global) {
			P.clients.forEach(function(client) {
				client.socket.emit("crafty-destroy", { selector: selector });
			});
		}

		else {
			P.socket.emit("crafty-destroy", { selector: selector });
		}
		

		this.scripts.forEach(function(script) {
			if (script.onDestroy) script.onDestroy();
		});

		return this;
	};

	this.call = function(method, params) {
		if (this.global) {
			P.clients.forEach(function(client) {
				client.socket.emit("crafty-call", { selector: selector, method: method, params: params });
			});
		}

		else {
			P.socket.emit("crafty-call", { selector: selector, method: method, params: params });
		}

		return this;
	};

	this.bind = function(e, callback) {
		var callbackString = require("node-uuid").v4();

		if (this.global) {
			P.clients.forEach(function(client) {
				client.socket.on(callbackString, function(data) {
					if (callback) {
						callback.apply(this, [client, data]);
					}
				});

				client.socket.emit("crafty-on", { selector: selector, eventName: e, callback: callbackString });
			});
		}

		else {
			P.socket.on(callbackString, function(data) {
				if (callback) {
					callback.apply(this, [P, data]);
				}
			});

			P.socket.emit("crafty-on", { selector: selector, eventName: e, callback: callbackString });
		}
	};

	this.addScript = function(script) {
		var s = new script(this);
		this.scripts.push(s);
		if (s.onSetup) s.onSetup(this);

		return this;
	};

	this.createFor = function(client) {
		client.socket.emit("crafty-create", { selector: this.selector });

		this.scripts.forEach(function(script) {
			if (script.onSetup) script.onSetup(P.crafty(selector, client));
		});
	};
};

var CraftyModule = function(P) {
	P.crafty = function(selector) {
		return new Crafty(selector, P);
	};

	P.globalCrafty = function(selector) {
		global.entities = global.entities || {};
		global.entities[selector] = new Crafty(selector, P, true);
		return global.entities[selector];
	};
};

module.exports = CraftyModule;
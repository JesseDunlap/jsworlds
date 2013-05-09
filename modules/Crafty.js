var Crafty = function(map, selector, P, global) {
    this.map            = map;
    this.selector       = selector;
    this.P              = P;
    this.global         = global || false;
    this.scripts        = [];

    this.create = function() {
        var $this = this;

        if (this.global) {
            P.clients.forEach(function(client) {
                client.socket.emit("crafty-create", { selector: $this.selector });
            })
        }

        else {
            P.socket.emit("crafty-create", { selector: $this.selector });
        }

        this.scripts.forEach(function(script) {
            if (script.onCreate) script.onCreate($this);
        });

        return this;
    };

	this.destroy = function() {
        var $this = this;

		if (this.global) {
			P.clients.forEach(function(client) {
				client.socket.emit("crafty-destroy", { selector: $this.selector });
			});
		}

		else {
			P.socket.emit("crafty-destroy", { selector: $this.selector });
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
        if (typeof script === 'string') {
            this.handleScript(require('../app/public/assets/scripts/' + script));
        }

        else {
            this.handleScript(script);
        }

        return this;
	};

    this.handleScript = function(script) {
        var instance = new script(this);
        if (instance.onSetup) instance.onSetup(this);

        this.scripts.push(instance);
        return this;
    };

	this.createFor = function(client) {
        var $this = this;

		client.socket.emit("crafty-create", { selector: this.selector });

		this.scripts.forEach(function(script) {
			if (script.onSetup) script.onSetup(P.crafty($this.map, $this.selector, client));
		});

        return this;
	};



    this.addComponent = function(component) {
        return this.call("addComponent", [component]);
    };

    this.attr = function(attr) {
        return this.call("attr", [attr]);
    };
};

var CraftyModule = function(P) {
	P.crafty = function(map, selector, client) {
        client = client || P;
		return new Crafty(map, selector, client);
	};

	P.globalCrafty = function(map, selector) {
		global.entities = global.entities || {};
        global.entities[map] = global.entities[map] || {};

		global.entities[map][selector] = new Crafty(map, selector, P, true);
		return global.entities[map][selector];
	};
};

module.exports = CraftyModule;
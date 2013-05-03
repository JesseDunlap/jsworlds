var HelpersModule = function(P) {
	P.title = function(title) {
		P.emit("setTitle", title);
	};	
	
	P.hash = function(hash) {
		if (P.socket) P.socket.emit("hashchange", hash);
	};
	
	P.autorouteHash = function(data) {
		if (data.controller && data.action) {
			try {
				P.controller(data.controller)[data.action](data.params);
			}
			
			catch (e) {
				
			}
		}
	};
	
	P.lib = function(lib) {
		var lib = require('../lib/' + lib);
		return new lib(P);
	};
	
	P.parseDataURL = function(string) {
		var data = string.split(",")[1];
		var buffer = new Buffer(data, 'base64');
		return buffer;
	};
	
	P.pdu = P.parseDataURL;
	
	P.alert = function(text) {
		P.$('body').append("<script>alert('" + text + "');</script>");
	};
	
	P.closeWindow = function() {
		P.$('body').append("<script>window.close()</script>");
	};
	
	P.eval = function(script) {
		P.$('body').append("<script>" + script + "</script>");
	};
	
	P.use = function(lib) {
		return require('../lib/' + lib.replace(/\./g, "/"));
	};
};


module.exports = HelpersModule;
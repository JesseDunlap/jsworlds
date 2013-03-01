exports.module = function(P) {
	P.globe = require('../lib/p/global');
	
	P.title = function(title) {
		P.emit("setTitle", title);
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

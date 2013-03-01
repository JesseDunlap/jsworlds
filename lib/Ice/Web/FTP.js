/**
 * FTP
 * Provides the ability to connect to and manipulate FTP servers
 */

var ftp = require('ftp');

var Client = function(host, port, config) {
	this.config				=	config || {};
	this.config.host		=	host || "localhost";
	this.config.port		=	port || 21;
	this.client				=	new ftp();
};

Client.prototype.setUser = function(username) {
	this.config.user = username;
};

Client.prototype.setPassword = function(password) {
	this.config.password = password;
};

Client.prototype.setHost = function(host) {
	this.config.host = host;
};

Client.prototype.setPort = function(port) {
	this.config.port = port;
};

Client.prototype.connect = function() {
	var $this = this;
	
	this.client.connect(this.config);
	
	this.client.on("ready", function() {
		$this.connected = true;
		if (callback) callback({ error: false });
	});
	
	this.client.on("error", function(e) {
		$this.connected = false;
		if (callback) callback({ error: e });
	});
	
	this.client.on("end", function() {
		$this.connected = false;
	});
};

Client.prototype.disconnect = function() {
	this.client.end();
};

Client.prototype.isConnected = function() {
	return (this.connected === true);
};

Client.prototype.on = function(on, callback) {
	this.client.on(on, callback);
};

Client.prototype.off = function(off) {
	this.client.off(off);
};


Client.prototype.listDirectory = function(path, callback, compression) {
	compression = compression || false;
	this.client.list(path, compression, callback);
};

Client.prototype.read = function(path, callback, compression) {
	compression = compression || false;
	this.client.get(path, compression, callback);
};

Client.prototype.write = function(path, callback, compression) {
	compression = compression || false;
	this.client.put(path, compression, callback);
};

Client.prototype.append = function(path, callback, compression) {
	compression = compression || false;
	this.client.append(path, compression, callback);
};

Client.prototype.rename = function(oldPath, newPath, callback) {
	this.client.rename(old, newPath, callback);
};

Client.prototype.move = function(oldPath, newPath, callback) {
	this.rename(oldPath, newPath, callback);
};

Client.prototype.delete = function(path, callback) {
	this.client.delete(path, callback);
};

Client.prototype.abort = function(callback) {
	this.client.abort(callback);
};

Client.prototype.getStatus = function(callback) {
	this.client.status(callback);
};

Client.prototype.makeDirectory = function(path, recursive, callback) {
	this.client.mkdir(path, recursive, callback);
};

Client.prototype.deleteDirectory = function(path, callback) {
	this.client.rmdir(path, callback);
};

Client.prototype.getSystem = function(callback) {
	this.client.system(callback);
};

Client.prototype.getSize = function(path, callback) {
	this.client.size(path, callback);
};

module.exports.Client = Client;
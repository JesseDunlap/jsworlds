/**
 * Encryption
 * Provides various methods of encryption, both one-way and two-way
 */

var crypto = require('crypto');

exports.base64Encode = function(string, encoding) {
	return new Buffer(string, encoding || "utf8").toString("base64");
};

exports.base64Decode = function(string, encoding) {
	return new Buffer(string, "base64").toString(encoding || 'utf8');
};

exports.sha1 = function(string) {
	return require('sha1')(string);
};

exports.md5 = function(string) {
	return require('MD5')(string);
};
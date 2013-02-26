/**
 * Debugger
 * Allows you to print helpful debug messages to the client, and handles
 * advanced types of debugging.
 */

exports.module = function(P) {
	P.log = {
		error: 	function(message, options) {
			console.log("\u001b[31m[ERROR]\u001b[0m\t\t" + message);
		},
		
		notice: function(message, options) {
			console.log("\u001b[34m[NOTICE]\u001b[0m\t" + message);
		},
		
		warning: function(message, options) {
			console.log("\u001b[33m[WARNING]\u001b[0m\t" + message);
		}
	};
};
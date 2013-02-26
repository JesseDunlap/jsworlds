/**
 * app Controller
 * Handles main events that happen with your application
 * such as when they load, exit, or before any controller
 */

module.exports = function(P) {	
	/**
	 * onLoad
	 * Called when the application starts 
	 * WARNING: You must trigger callback otherwise the app won't load.
	 */
	this.onLoad = function(callback) {
		P.depends(["Accounts"]);
		P.accounts.init(callback);
	};
	
	/**
	 * onExit
	 * Called when the application stops (the user disconnects)
	 */
	this.onExit = function() {
		
	};
	
	/**
	 * beforeFilter
	 * Called before any controller is loaded
	 */
	this.beforeFilter = function(controller_name, data) {

	};
};
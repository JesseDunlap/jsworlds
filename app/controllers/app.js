/**
 * app Controller
 * Handles main events that happen with your application
 * such as when they load, exit, or before any controller
 */

module.exports = function(P) {	
	global.events = global.events || {};

	/**
	 * Adds an event listener, corresponding to a string event, with a callback.
	 *
	 * @param		string e 				The name of the event you want to listen for.
	 * @param 		function callback 		The callback function which will be triggered.
	 */
	global.on = function(e, callback) {
		global.events[e] = global.events[e] || [];
		global.events[e].push(callback);
	};

	/**
	 * Removes a specific event listener, or every listener for an event.
	 *
	 * @param 		string e 				The name of the event you wish to remove.
	 * @param 		[function callback] 	The specific callback you want to remove (instead of all of them).
	 */
	global.off = function(e, callback) {
		global.events[e] = global.events[e] || [];

		if (callback)
			global.events[e].splice(global.events[e].indexOf(callback), 1);
		else
			global.events[e] = [];
	};

	/**
	 * Triggers a specified event.
	 *
	 * @param 		string e 				The name of the event you wish to trigger.
	 * @param 		id data 				Any data you wish to pass to the associated callbacks.
	 */
	global.emit = function(e, data) {
		global.events[e] = global.events[e] || [];
		global.events[e].forEach(function(cb) { cb(data) });
	};


	/**
	 * onLoad
	 * Called when the application starts 
	 * WARNING: You must trigger callback otherwise the app won't load.
	 */
	this.onLoad = function(callback) {
		P.db = P.lib("p/mongo").connect(["maps"]);		
		P.depends(["Accounts"]);

		P.accounts.init(function() {
			if (P.globe.maps === undefined || P.globe.maps === {}) {
				P.controller("map").index();
				P.controller("map").loadMaps(callback);
			}

			else {
				callback();
			}
		});
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
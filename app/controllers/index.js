/**
 * index Controller
 * This is the default "home" controller. The app, will go to the
 * index action first.
 */

module.exports = function(P) {
	this.index = function() {
		console.log("Something");

		if (P.accounts.isLoggedIn()) {
			console.log("X");
			P.controller("game").index();
			P.controller("map").edit();
		}
		
		else {
			console.log("Y");
			P.controller("account").login();
		}
	};
};
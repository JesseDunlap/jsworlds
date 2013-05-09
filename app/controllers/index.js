/**
 * index Controller
 * This is the default "home" controller. The app, will go to the
 * index action first.
 */

module.exports = function(P) {
	this.index = function() {
		if (P.accounts.isLoggedIn()) {
			if (global.entities) {
				for (var selector in global.entities) {
					global.entities[selector].createFor(P);
				}
			}

			P.controller("game").index();
			P.controller("map").edit();
		}
		
		else {
			P.controller("account").login();
		}
	};
};
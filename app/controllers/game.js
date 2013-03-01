/**
 * Handles all actions corresponding to rendering and starting the game
 * interface.
 */

module.exports = function(P) {
	this.index = function() {
		P.$('body').render("game/index");
	};
};
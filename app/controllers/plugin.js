var PluginController = function(P) {
	this.test = function() {

		P.globalCrafty("test").create()

		.addScript(function(entity) {
			this.onSetup = function(e) {
				e.call("addComponent", ["2D, Canvas, playerSprite0, Mouse"])

				.call("attr", [{
					x: 50,
					y: 50,
					w: 100,
					h: 100,
					z: 10
				}])

				.bind("Click", function(sender, e) {
					sender.alert("Clicked");
				});
			};
		});
	};
};

module.exports = PluginController;
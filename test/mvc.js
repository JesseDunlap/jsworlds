/**
 * Exercises P's Model, View, Controller (MVC) architecture to make
 * sure it is performing as expected.
 */

var helpers = require("./helpers/p");

module.exports.MVC = {
	setUp: function(callback) {
		this.P = helpers.setupP();
		callback();
	},
	
	tearDown: function(callback) {
		if (require("fs").existsSync("app/controllers/test.js")) require("fs").unlinkSync("app/controllers/test.js");
		if (require("fs").existsSync("app/views/en/testview.ejs")) require("fs").unlinkSync("app/views/en/testview.ejs");
		callback();
	},
	
	Controllers: function(test) {
		/** Test Controller Loading **/
		helpers.copyTemplate("controller1.js", "app/controllers/test.js");
		test.equal(this.P.controller("test").index(), true, "Controller loading failed.");
		
		/** Test Controller Automatic Reloading **/
		helpers.copyTemplate("controller2.js", "app/controllers/test.js");
		test.equal(this.P.controller("test").index(), false, "Controller reloading failed.");
		
		test.done();
	},
	
	Models: function(test) {
		test.done();
	},
	
	Views: function(test) {
		/** Test Snippets **/
		helpers.copyTemplate("view1.ejs", "app/views/en/testview.ejs");
		test.equal(this.P.snippet("testview"), helpers.getTemplate("view1.ejs"));
		
		/** Test Processing Snippets **/
		helpers.copyTemplate("view2.ejs", "app/views/en/testview.ejs");
		test.equal(this.P.snippet("testview", { x: 2 }), "2");
		
		test.done();
	}
};
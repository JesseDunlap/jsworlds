var IndexController = function(P) {
	this.isSetup = false;
	
	this.index = function() {
		if (!this.isSetup)
			this.setup();
		
		if (P.accounts.isLoggedIn() && P.accounts.hasPermission(global.config.app.platform.requiredPermission)) {
			P.platform.controller("dashboard").index();
		}	
		
		else {
			P.platform.controller("account").login();
		}
	};
	
	this.setup = function() {
		P.$("body").render("lib/hydrais/p/platform/views/index.ejs");
		this.isSetup = true;
	};
	
	this.hide = function() {
		P.$("#platform").remove();
	};
	
	this.test = function(data) {
		console.log(data);
	};
};

module.exports = IndexController;
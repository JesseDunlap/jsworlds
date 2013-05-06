var AccountController = function(P) {
	this.login = function(data) {
		if (!data) {
			P.platform.render("account/login");
		}
		
		else {
			P.accounts.login(data.email, data.password, function(loggedIn) {
				if (loggedIn && P.accounts.hasPermission(global.config.app.platform.requiredPermission)) {
					P.platform.controller("index").index();
				}
				
				else {
					P.$("#loginError").html("Invalid email or password, or your account does not have the required permissions.").show();
					P.accounts.logout();
				}
			});
		}
	};
	
	this.logout = function() {
		P.accounts.logout();
		P.platform.controller("index").index();
	};
};

module.exports = AccountController;
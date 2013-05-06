var DashboardController = function(P) {
	this.index = function() {
		P.platform.render("dashboard/index");
	};
	
	this.users = function() {
		P.accountDb.accounts.find({}, function(error, results) {
			P.platform.render("dashboard/index", { accounts: results });
		});
	};
};

module.exports = DashboardController;
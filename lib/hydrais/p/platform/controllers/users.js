var UsersController = function(P) {
	this.index = function() {
		P.platform.renderSidebar("users/sidebar");
		P.platform.renderContent("users/index");
		this.all();
	};
	
	this.all = function() {
		P.accountDb.accounts.find({}, function(err, results) {
			P.platform.renderContent("users/list", { accounts: results });
		});
	};
	
	this.create = function(data) {
		console.log(data);
		
		if (!data.submitted) {
			P.platform.popup("users/create");
		}
		
		else {
			console.log(data);
		}
	};
};

module.exports = UsersController;
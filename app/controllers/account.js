/** 
 * Handles authentication, registration, and modification of accounts.
 */

module.exports = function(P) {
	/**
	 * Redirects the user back to the index controller, because
	 * the accounts controller cannot be accessed using the index
	 * action.
	 */
	this.index = function() {
		P.controller("index").index();
	};
	
	/**
	 * Renders the login view, or attempts to authenticate the user
	 * if they have submitted login data.
	 *
	 * @param loginData Form submitted login data.
	 */
	this.login = function(data) {
		if (data === undefined) {
			P.$('body').render("account/login");
		}
		
		else {
			// Check that the login data has been submitted and validates. If not,
			// show an error message and prevent further execution.
			if (data.email === undefined || data.password === undefined) {
				P.$('#loginError').html("Invalid email address or password.").show();
				return;
			}
			
			P.accounts.login(data.email, data.password, function(success) {
				if (success) {
					P.controller("index").index();
				}

				else {
					P.$("#loginError").html("Invalid email address or password.").show();
				}
			});
		}
	};
	
	/**
	 * Renders the register view, or attempts to register a new user
	 * if they have submitted registration data. Redirects the user
	 * to the login page upon successful registration.
	 *
	 * @param account Form submitted account data.
	 */
	this.register = function(account) {
		if (account === undefined) {
			P.$('body').render("account/register");
		}
		
		else {
			P.accounts.register(account, function() {
				P.controller("account").login();
			});
		}
	};
};
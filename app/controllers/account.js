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
	this.login = function(loginData) {
		if (loginData === undefined) {
			P.$('body').render("account/login");
		}
		
		else {
			// Check that the login data has been submitted and validates. If not,
			// show an error message and prevent further execution.
			if (loginData.username === undefined || loginData.password === undefined || loginData.username.length === 0 || loginData.password.length === 0) {
				P.$('#loginError').html(P.string("invalid_login")).show();
				return;
			}
			
			P.accounts.login(loginData.username, loginData.password, function(loggedIn) {
				if (loggedIn) {
					P.controller("index").index();
				}
				
				else {
					P.$('#loginError').html(P.string("invalid_login")).show();
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
			P.account = account;
		
			P.accounts.register(function() {
				P.controller("account").login();
			});
		}
	};
};
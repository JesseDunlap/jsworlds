/**
 * AccountSystem
 * Provides an abstraction for user account creation, authentication, and modification
 */

var AccountsModule = function(P) {
	var $this = this;
	
	P.dependOn(["Session"]);
	
	P.accounts = {
		getSkeleton: function() {
			return {
				password: 		"",
				firstName: 		"",
				lastName: 		"",
				email: 			"",

				additionalData: {}
			};
		},
		
		isLoggedIn: function() {
			return (P.account !== undefined && P.account._id !== undefined);
		},
		
		init: function(callback) {
			P.session("accountLogin", function(accountLogin) {
				
				if (P.accountDb === undefined)				
					P.accountDb = P.lib("hydrais/p/mongo").connect(["accounts"]);
			
				if (accountLogin === undefined || accountLogin === "null") {
					P.account = P.accounts.getSkeleton();
					callback();
				}
			
				else {
					try {
						P.accountDb.accounts.find({ 
							_id: 	P.accountDb.ObjectId(accountLogin) 
						},
				
						function(error, results) {
							if (error) {
								console.error("Error when communicating with the Account Database.");
								return;
							}
					
							if (results.length > 0) {
								delete results[0].password;
								delete results[0].salt;
								P.account = results[0];
								callback();
								return;
							}
					
							/** 
							 * Skeleton Account
							 */
							P.account = P.accounts.getSkeleton();
							callback();
						});
					}
				
					catch (e) {
						throw e;
					}
				}
			});
		},
		
		hasPermission: function(permission) {
			if (P.account === undefined) return;
			P.account.permissions = P.account.permissions || [];
			return (P.account.permissions.indexOf(permission) != -1);
		},
		
		grant: function(permission, callback) {
			if (P.account === undefined) return;
			P.account.permissions = P.account.permissions || [];
			P.account.permissions.push(permission);
			P.accounts.update(callback);
		},
		
		redact: function(permission, callback) {
			if (P.account === undefined) return;
			P.account.permissions = P.account.permissions || [];
			P.account.permissions.splice(P.account.permissions.indexOf(permission), 1);
			P.accounts.update(callback);
		},
		
		grav: function(email) {
			var md5 = require("MD5");
			return "http://gravatar.com/avatar/" + md5(email)
		},
		
		getGravatar: function() {
			if (P.account === undefined) return;
			return $this.grav(P.account.email);
		},
	
		update: function(callback) {
			if (P.account === undefined) {
				console.error("P.account is undefined, update cannot continue.");
				return;
			}
			
			P.accountDb.accounts.save(P.account, callback);
		},
	
		register: function(accountData, callback) {
			require("bcrypt-nodejs").genSalt(global.config.accounts.saltRounds || 10, function(err, result) {
				accountData.salt = result;
				accountData.password = require("bcrypt-nodejs").hashSync(accountData.password, accountData.salt);
				accountData.permissions = accountData.permissions || [];
				
				// Add the default permissions from the configuration file
				global.config.accounts.defaultPermissions.forEach(function(perm) {
					accountData.permissions.push(perm);
				});
				
				P.accountDb.accounts.save(accountData, callback);
			});
		},
		
		logout: function() {
			P.session("accountLogin", "null");
			P.account = P.accounts.getSkeleton();
		},
		
		login: function(email, password, callback) {
			/**
			 * Fetch the SALT from the database
			 */
			P.accountDb.accounts.find({
				email: 		email
			},
			
			function(error, results) {
				if (error || results.length == 0) {
					callback(false, error, results);
					return;
				}
				
				var salt = results[0].salt;
				password = require("bcrypt-nodejs").hashSync(password, salt);
			
				if (results[0].password === password && results[0].email === email) {
					/**
					 * there was a matched account, send a true response
					 * and preserve the account ID in a session
					 */
					delete results[0].password;
					delete results[0].salt;
					P.account = results[0];
					callback(true, error, results);
					
					P.session("accountLogin", results[0]._id);
				}
				
				else {
					callback(false, error, results);
				}
			});
		}
	};
	
	if (P.socket) {
		P.socket.on("disconnect", function(data) {
			if (P.accoutDb && P.accountDb.close) P.accountDb.close();
		});
	}
};

module.exports = AccountsModule;
module.exports.autoload = false;
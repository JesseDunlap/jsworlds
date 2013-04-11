/**
 * AccountSystem
 * Provides an abstraction for user account creation, authentication, and modification
 */

exports.autoload = false;

exports.module = function(P) {
	P.depends(["Session"]);
	
	P.accounts = {
		getSkeleton: function() {
			return {
				username: 		"",
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
			if (P.accountDb === undefined)				
				P.accountDb = P.lib("p/mongo").connect(["accounts"]);
			
			if (P.session("accountLogin") === undefined || P.session("accountLogin") === "null") {
				P.account = P.accounts.getSkeleton();
				callback();
			}
			
			else {
				P.accountDb.accounts.find({ 
					_id: 	require("mongojs")({}).ObjectId(P.session("accountLogin"))
				},
			
				function(error, results) {
					if (error) {
						P.log.error("Error when communicating with the Account Database.");
						return
					}
				
					if (results.length > 0) {
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
		},
		
		grav: function(email) {
			var md5 = require("MD5");
			return "http://gravatar.com/avatar/" + md5(email)
		},
		
		getGravatar: function() {
			if (P.account === undefined) return;
			return this.grav(P.account.email);
		},
	
		update: function(callback) {
			if (P.account === undefined) {
				P.log.error("P.account is undefined, update cannot continue.");
				return;
			}
			
			P.accountDb.accounts.save(P.account, callback);
		},
	
		register: function(callback) {
			if (P.account === undefined) {
				P.log.error("P.account is undefined, registration cannot continue.");
				return;
			}
			
			P.account.password = require('sha1')(P.account.password);
			
			P.accountDb.accounts.save(P.account, callback);
		},
		
		logout: function() {
			P.session("accountLogin", "null");
			P.account = P.accounts.getSkeleton();
		},
		
		login: function(username, password, callback) {
			password = require("sha1")(password);
			
			/**
			 * Check if username and password match an account
			 */
			P.accountDb.accounts.find({
				username: 		username,
				password: 		password
			},
			
			function(error, results) {
				if (error) {
					/**
					 * an error occured, do not continue
					 */
					callback(false, error, results);
					return;
				}
				
				if (results.length > 0) {
					/**
					 * there was a matched account, send a true response
					 * and preserve the account ID in a session
					 */
					P.account = results[0];
					callback(true, error, results);
					P.session("accountLogin", results[0]._id);
				}
				
				else {
					/**
					 * the username and password didn't match, let's check 
					 * if the e-mail matches.
					 */
					P.accountDb.accounts.find({
						email: 		username,
						password: 	password
					},
					
					function(error1, results1) {
						if (error1) {
							/**
							 * an error occured, do not continue
							 */
							callback(false, error1, results1);
							return;
						}
						
						if (results1.length > 0) {
							/**
							 * there was a matched account, send a true response
							 * and preserve the account ID in a session
							 */
							P.account = results1[0];
							callback(true, error1, results1);
							P.session("accountLogin", results1[0]._id);
						}
						
						else {
							/**
							 * okay, there's really no match, they're just not
							 * correct about their login, send a false response
							 */
							callback(false, error1, results1);
						}
					});
				}
			})
		}
	};
	
	P.socket.on("disconnect", function(data) {
		if (P.accoutDb && P.accountDb.close) P.accountDb.close();
	});
};
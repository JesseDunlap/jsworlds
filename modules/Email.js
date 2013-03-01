/**
 * Email Module
 * Provides a wrapper around the Node "email" module. Currently
 * supports minimal configuration, and just uses the host's
 * "sendmail" module. SMTP support is coming soon.
 */

var Email = require('email').Email;

exports.module = function(P) {
	
	/**
	 * P.email(to, subject, message, [options, callback])
	 * Sends an email to the specified recipient.
	 *
	 * @param		string to			-	A recipient email address
	 * @param		string subject		-	The subject of the email
 	 * @param		string message		-	The body of the email
 	 * @param		object [options]	-	A key-value pair of options for node-email
     * @param 		function [callback] - 	Will be triggered with any errors when the message send request is complete.
 	 */
	P.email = function(to, subject, message, options, callback) {
		P.log.warning("The Email module has been deprecated in P 1.1, replaced by the Ice.Web.Email class");
			
		if (typeof options == 'function') callback = options;
		
		var from = P.config.email.sendFrom;
		
		var config = {
			to: 		to,
			from: 		from,
			subject: 	subject,
			body: 		message
		};
		
		if (options)
			P.extend(config, options);
			
		var mail = new Email(config);
		
		mail.send(callback);
	};
	
	/**
	 * P.emailView(to, subject, view, options, callback)
	 * Sends an email whose body is an HTML view.
	 */
	P.emailView = function(to, subject, view, options, callback) {
		if (options === undefined) options = {};
		
		options.bodyType = "html";
		P.email(to, subject, P.snippet(view, options), options, callback);
	};
};
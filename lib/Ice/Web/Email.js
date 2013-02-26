var mailer = require('nodemailer');

/**
 * Email
 * Provides an Email class, which can be used to send emails via sendmail,
 * SES (Amazon SES), or SMTP
 */



/***************************************
 * Configuration Setup
 ***************************************/

if (global.ice === undefined) 					global.ice = {};
if (global.ice.config === undefined) 			global.ice.config = {};
if (global.ice.config.email === undefined) 		global.ice.config.email = {};


/***************************************
 * Email Class
 ***************************************/

var Email = function(to, subject, message, config) {
	this.config = {
		email: {
			to: 					to,
			subject: 				subject,
			html: 					message,
			generateTextFromHTML: 	true,
			type: 					"text/plain"
		},
		
		transport: {
			type: 				"sendmail",
			smtp: 				{},
			sendmail: 			{},
			ses: 				{}
		}
	};
	
	/**
	 * Merge Global Configuration
	 */
	if (global.ice.config.email != {}) {
		for (var key in global.ice.config.email) {
			this.config[key] = global.ice.config.email[key];
		}
	}
};


Email.prototype.send = function(callback) {
	switch (this.config.transport.type) {
		case "sendmail":
			var transport = mailer.createTransport("sendmail", this.config.transport.sendmail);
			transport.sendMail(this.config.email, callback);
			break;
			
		case "smtp":
			var transport = mailer.createTransport("SMTP", this.config.transport.smtp);
			transport.sendMail(this.config.email, callback);
			break;
		
		case "ses":
			var transport = mailer.createTransport("SES", this.config.transport.ses);
			transport.sendMail(this.config.email, callback);
			break;
			
		default:
			console.error("[Error in Ice.Web.Email]\t\tInvalid transport type: " + this.config.transport.type);
			return;
			break;
	}
};

Email.prototype.setTransport = function(type) {
	this.config.transport.type = type;
};

Email.prototype.setServiceURL = function(url) {
	this.config.transport.ses.ServiceUrl = url;
};

Email.prototype.setAWSAccessKey = function(key) {
	this.config.transport.ses.AWSAccessKeyID = key;
};

Email.prototype.setAWSSecret = function(secret) {
	this.config.transport.ses.AWSSecretKey = secret;
};

Email.prototype.setSendmailPath = function(path) {
	this.config.transport.sendmail.path = path;
};

Email.prototype.setSendmailArgs = function(args) {
	this.config.transport.sendmail.args = args;
};

Email.prototype.setService = function(service) {
	this.config.transport.type = "smtp";
	this.config.transport.smtp.service = service;
};

Email.prototype.setUser = function(user) {
	this.config.transport.smtp.user = user;
};

Email.prototype.setPassword = function(pass) {
	this.config.transport.smtp.pass = pass;
};

Email.prototype.setHost = function(host) {
	this.config.transport.smtp.host = host;
};

Email.prototype.setPort = function(port) {
	this.config.transport.smtp.port = port;
};

Email.prototype.setSecure = function(secure) {
	this.config.transport.smtp.secureConnection = secure;
};

Email.prototype.setFrom = function(from) {
	this.config.email.from = from;
};

Email.prototype.setTo = function(to) {
	this.config.email.to = to;
};

Email.prototype.setCc = function(cc) {
	this.config.email.cc = cc;
};

Email.prototype.setBcc = function(bcc) {
	this.config.email.bcc = bcc;
};

Email.prototype.setReplyTo = function(replyTo) {
	this.config.email.replyTo = replyTo;
};

Email.prototype.setInReplyTo = function(inReplyTo) {
	this.config.email.inReplyTo = inReplyTo;
};

Email.prototype.setReferences = function(references) {
	this.config.email.references = references;
};

Email.prototype.setSubject = function(subject) {
	this.config.email.subject = subject;
};

Email.prototype.setBody = function(body) {
	switch (this.config.email.type) {
		case "text/plain":
			this.config.email.text = body;
			break;
		
		case "html":
			this.config.email.html = body;
			break;
			
		default:
			this.config.email.text = body;
			break;
	}
};

Email.prototype.setHeaders = function(headers) {
	this.config.email.headers = headers;
};

Email.prototype.setHeader = function(key, value) {
	if (this.config.email.headers === undefined) this.config.email.headers = {};
	this.config.email.headers[key] = value;
};

Email.prototype.setAlternativeText = function(altText) {
	this.config.email.alternatives = (typeof altText === 'string') ? [altText] : altText;
};

Email.prototype.setMessageId = function(messageID) {
	this.config.email.messageId = messageID;
};

Email.prototype.setDate = function(date) {
	this.config.email.date = date;
};

Email.prototype.setEncoding = function(encoding) {
	this.config.email.encoding = encoding;
};

Email.prototype.setCharset = function(charset) {
	this.config.email.charset = charset;
};

Email.prototype.addAttachment = function(attachment) {
	if (this.config.email.attachments === undefined) this.config.email.attachments = [];
	this.config.email.attachments.push(attachment);
};




/***************************************
 * SMTP Service Constants
 ***************************************/

var Service = {
	DynectEmail: 			"DynectEmail",
	Gmail: 					"Gmail",
	HotEE: 					"hot.ee",
	Hotmail: 				"Hotmail",
	iCloud: 				"iCloud",
	MailEE: 				"mail.ee",
	MailRU: 				"mail.ru",
	Mailgun: 				"Mailgun",
	Mandrill: 				"Mandrill",
	Postmark: 				"Postmark",
	SendGrid: 				"SendGrid",
	SES: 					"SES",
	Yahoo: 					"Yahoo",
	Yandex: 				"yandex",
	Zoho: 					"Zoho"
};


var TransportType = {
	SMTP: 					"smtp",
	SES: 					"ses",
	Sendmail: 				"sendmail"
};

var ContentType = {
	HTML: 					"html",
	PlainText: 				"text/plain"
};

/***************************************
 * Exports
 ***************************************/

module.exports 					= Email;
module.exports.Service 			= Service;
module.exports.TransportType 	= TransportType;
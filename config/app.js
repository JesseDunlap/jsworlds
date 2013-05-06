module.exports = {
	session: {
		// A unique identifier for your app, which helps keep it separated
		// from other P web applications.
		sessionID: 						"change_me",
		
		// Determines if the session system will use flat-file storage, or
		// Redis. Options are "file" or "redis"
		mode: 							"file",
		
		// The following settings are for configuring Redis
		redis: {
			host: 						"127.0.0.1",
			port: 						6379,
			password: 					""
		}
	},
	
	platform: {
		// Set to true to enable Platform, a backend management dashboard for your
		// P framework application.
		enabled: 						true,
		
		// Platform will only allow users with the following permission to access the
		// system. This utilizes the P Accounts module. Set to "user" to allow semi-public access
		requiredPermission: 			"admin"
	},
	
	// Allows you to customize the node environment
	environment: 					process.env.NODE_ENV,
	
	// The default templating engine you wish to use
	templatingEngine: 				"ejs",
	
	// The language which will be used for loading views
	localization: 					"en"
};
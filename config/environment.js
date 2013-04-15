/**
 * environment config
 * sets specific configuration options for different environments
 */

module.exports = function(P) {

	P.configure({ environment: "development" });

	switch(P.config.environment)
	{
		/**
		 * the "development" environment should be configured to give
		 * as much helpful debug information as possible, and should use
		 * some form of local database.
		 */
		case "development":
			P.configure({
                /**
                 * By changing the localizaton variable, you can quickly
                 * switch between various different languages. Views will
                 * automatically be loaded according to your localization
                 *
                 * Example:
                 *  If your localization is "en" your views will be looked for in
                 *  "app/views/en/"
                 */
                localization:       "en",

				/**
				 * forever_config allows you to set configuration for the 
				 * forever node module: https://github.com/nodejitsu/forever
				 */
				forever_config: {
					silent: 		false,
					logFile: 		'log/production/main.txt',
					outFile: 		'log/production/out.txt',
					errFile: 		'log/production/errors.txt'
				},
				
				
				/**
				 * mongo allows you to change what database your app can
				 * use when you load the MongoDB lib.
				 */
				mongo: {
					host: 			"54.225.79.57",
					port: 			"default",
					username:		"",
					password: 		"",
					dbname: 		"jsworlds"
				},


				/**
				 * templatingEngine
				 * Changing this variable will allow you to change which rendering
				 * engine P uses. The default is "ejs". Please consult the documentation
				 * for the rendering engine you are using to find the proper value.
				 */
				templatingEngine: 	"ejs",
				
				/**
				 * email configuration
				 */
				email: {
					sendFrom: 		"noreply@server.com"
				},
			  
			  	platformEnabled: true
			});
		
			break;
	
		/**
		 * the "production" environment should be configured to give
		 * very little debug information to the user, instead reporting
		 * it in the background to the developers. It should connect to
		 * some form of stable, scalable database.
		 */	
		case "production":
			P.configure({
				/**
				 * forever_config allows you to set configuration for the 
				 * forever node module: https://github.com/nodejitsu/forever
				 */
				forever_config: {
					silent: 		true,
					watch:  		true,
					logFile: 		'log/production/main.txt',
					outFile: 		'log/production/out.txt',
					errFile: 		'log/production/errors.txt'
				},
				
				/**
				 * mongo allows you to change what database your app can
				 * use when you load the MongoDB lib.
				 */
				mongo: {
					host: 			"54.225.79.57",
					port: 			"default",
					username:		"",
					password: 		"",
					dbname: 		"p"
				},
				
				email: {
					sendFrom: 		"noreply@server.com"
				},
			  
			  	platformEnabled: false
			});
		
			break;
	
		/**
		 * invalid configuration type specified!
		 */
		default:
			P.log.error(current_environment + " is not a valid environment. Please check config/environment.js");
	}

};

/**
 * api server configuration
 * allows you to configure how the P api server works
 */

// enabled
// set to true to enable the api server
// set to false to disable the api server
exports.enabled				=	true;



// host
// specifies what host the api server should listen on
exports.host				=	"0.0.0.0";


// port
// specifies the port that the api server should listen on
exports.port				=	8081;


// routes
// this allows you to add routes for the api server. routes should be in the following format:
// { url: "/the/url/to/listen/for", controller: "some_controller", action: "some_action"
//   method: "get/post" }
exports.routes				=	[
									{ url: "/", controller: "index", action: "index", method: "get" }
								];



// express
// here, you can specify various options to configure the
// express framework, which powers P's api server
exports.express				=	{
									"log level": 0
								};
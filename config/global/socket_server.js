/**
 * socket server configuration
 * allows you to configure how the P socket server works
 */

// enabled
// set to true to enable the socket server
// set to false to disable the socket server
exports.enabled				=	true;



// host
// specifies what host the socket server should listen on
exports.host				=	"0.0.0.0";


// port
// specifies the port that the socket server should listen on
exports.port				=	8080;


// socketIO
// here, you can specify various configuration options for
// socket.io. see https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
exports.socketIO			=	{
									"log level": 0
								};
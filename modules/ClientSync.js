/**
 * ClientSync
 * Allows clients to communicate!
 */

exports.module = function(P) {
	///////////////////////////////////
	// clientSync Setup
	///////////////////////////////////
	var global 		= require('../lib/p/global');
	if (global.clients === undefined) global.clients 	= [];
	
	var $this			=	this;
	P.username			=	"Anonymous";
	P.clients			=	require('../lib/p/global.js').clients;
	$this.last			=	P.clients;
	
	// add client to global clients list
	global.clients.push(P);
	
	setInterval(function() {
		if (P.clients != $this.last) P.emit("clients_changed", P.clients);
		$this.last = P.clients;
	}, 10);
	
	// handle client socket events
	P.on("disconnect", function() {
		global.clients.splice(global.clients.indexOf(P), 1);
	});
};
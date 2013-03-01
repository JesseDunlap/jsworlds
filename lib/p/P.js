/**
 * P
 * the uber file for the P framework!
 */

module.exports = function(socket) {
	var $this			=	this;
	this.socket			=	socket;
	this.loadedModules	=	[];
	this.events			=	{};
	this.config			=	{};
	
	
	/**
	 * depends
	 * checks the currently loaded modules list, and loads
	 * any that aren't already on the list.
	 */
	this.depends = function(dependencies) {
		dependencies.forEach(function(dependency) {
			if ($this.loadedModules.indexOf(dependency) == -1) {
				$this.loadedModules.push(dependency);
				require('../../modules/' + dependency).module($this);
			}
		});
	};
	
	
	/**
	 * on
	 * adds an event listener for a plasma event
	 */
	this.on = function(listener, callback) {		
		$this.socket.on(listener, callback);
		
		if (typeof $this.events[listener] !== 'undefined')
			$this.events[listener].push(callback);
		else
			$this.events[listener] = [callback];
	};
	
	
	/**
	 * emit
	 * emits a plasma event with optional arguments
	 */
	this.emit = function(listener, data, doNotSendOverSocket) {
		if (typeof $this.events[listener] !== 'undefined') {
			$this.events[listener].forEach(function(callback) {
				callback(data);
			});
		}
		
		if (doNotSendOverSocket !== true) {
			$this.socket.emit(listener, data);
		}
	};
	
	
	/**
	 * extend
	 * recursively merges two objects
	 */
	this.extend = function(obj1, obj2) {
		for (var p in obj2) {
			try {
		      	if ( obj2[p].constructor==Object ) {
		        	obj1[p] = MergeRecursive(obj1[p], obj2[p]);
		      	} 
		
				else {
		        	obj1[p] = obj2[p];
		      	}

		    } 
		
			catch(e) {
		      	// Property in destination object not set; create it and set its value.
		      	obj1[p] = obj2[p];
		    }
		}

		return obj1;
	};
	
	
	/**
	 * configure
	 * merges the newly specified configuration with
	 * the existing P configuration
	 */
	this.configure = function(new_config) {
		this.extend(this.config, new_config);
	};
};
var serialize = function(object) {	
	var doLevel = function(level) {
		var json = { _methods: {} };
		
		for (var key in level) {
			if (typeof level[key] === 'object') {
				json[key] = doLevel(level[key]);
			}
				
			else if (typeof level[key] === 'function') {
				json._methods[key]	= level[key].toString();
				json[key] 			= key;
			}
			
			else {
				json[key]		= level[key];
			}
		}
		
		return json;
	};
	
	return doLevel(object);
};


var deserialize = function(object) {
	var doLevel = function(level) {
		if (level._methods === undefined) level._methods = {};
		
		var json = {};
		var methods = [];
		
		for (var key in level) {
			if (key !== "_methods") {
				if (typeof level[key] === 'object') {
					json[key] = doLevel(level[key]);
				}
				
				else if (level._methods[key] !== undefined) {
					var rnd 	= "f" + Math.floor(Math.random() * 100);
					eval("methods['" + rnd + "'] = " + level._methods[key]);
					json[key] 	= methods[rnd];
					delete methods[rnd];
				}
			
				else {
					json[key] = level[key];
				}
			}
		}
		
		return json;
	};
	
	return doLevel(object);
};


exports.serialize = serialize;
exports.deserialize = deserialize;
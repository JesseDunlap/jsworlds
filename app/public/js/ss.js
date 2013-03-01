var SS = {};

SS.deserialize = function(object) {
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
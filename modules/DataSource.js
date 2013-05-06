var jw = require("watchvar");

var DataSource = function(data) {
	var $this		=	this;
	
	this.listeners	=	[];
	this.data		=	data || {};
	
	jw.watch(this.data, function(e) {
		$this.listeners.forEach(function(c) {
			c($this.data);
		});
	});
};

DataSource.prototype.change = function(callback) {
	this.listeners.push(callback);
};

DataSource.prototype.update = function() {
	var $this		=	this;
	
	this.listeners.forEach(function(c) {
		c($this.data);
	});
};

var DataSourceModule = function(P) {
	P.dataSource = function(data) {
		return new DataSource(data);
	};
	
	P.globalDataSource = function(name, data) {
		global.dataSources = global.dataSources || {};
		if (global.dataSources[name]) return global.dataSources[name];
		
		var dataSource = new DataSource(data);
		global.dataSources[name] = dataSource;
		return global.dataSources[name];
	};
};

module.exports = DataSourceModule;
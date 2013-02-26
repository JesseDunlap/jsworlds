/**
 * Model
 * Implements the Model portion of the P MVC
 */

exports.module = function(P) {
    if (!P.modelTypes) P.modelTypes = {};
/*
	P.modelTypes["mysql"] = {
		_pre: function() {
			if (P.db === undefined) {
	            P.log.error("P.db is not defined. Please define P.db as a MySQL connection, preferrably in app.js");
	            P.log.error("Example:\tP.db = P.lib(\"p/MySQL\").connect();");
	        }

			if (this.schema == {}) {
				P.log.error("Please specify a schema in all of your MySQL models.");
			}
			
			if (this.table === undefined || this.table == "") {
				P.log.error("Please specify a table in all of your MySQL models.");
			}
		},
		
		_queryMatchingSchema: function() {
			var query 		= [];
			var dataKeys 	= [];
			
			for (var key in this.data) {
				if (this.schema.indexOf(key) > -1) {
					query.push(key);
				}
			}
			
			return query;
		},
		
		create: function(callback) {
			P.modelTypes["mysql"]._pre();
			
			var matchingKeys 	= [];
			var values 			= [];
			
			for (var key in this.data) {
				matchingKeys.push(key);
				
				switch(typeof this.data[key]) {
					case 'string':
						values.push("\"" + this.data[key] + "\"");
						break;
						
					default:
						values.push(this.data[key]);
						break;
				}
			}
			
			var query 	= "insert into `" + this.table + "` (" + matchingKeys.join(", ") + ") values (" + values.join(", ") + ");";
			
		},
		
		read: function(columns, callback) {
			P.modelTypes["mysql"]._pre();
			
			var matchingKeys 	= [];
			var values 			= [];
			
			for (var key in this.data) {
				matchingKeys.push(key);
				
				switch(typeof this.data[key]) {
					case 'string':
						values.push("\"" + this.data[key] + "\"");
						break;
						
					default:
						values.push(this.data[key]);
						break;
				}
			}
			
			var wheres = [];
			
			for (var i = 0; i < matchingKeys.length; i++) {
				var key = matchingKeys[i];
				var val = values[i];
				var kv  = key + " = " + val;
				wheres.push(kv);
			}
			
			whereStatement = wheres.join(", ");			
			
			if (typeof columns == "string" && columns == "*") {
				var query = "select * from `" + this.table + "` where " + whereStatement + ";"
			}
			
			else {
				var query = "select (" + columns.join(", ") + ") from `" + this.table + "` where " + whereStatement + ";"
			}
			
			console.log(query);
		},
		
		update: function(callback) {
			P.modelTypes["mysql"]._pre();
			
			var matchingKeys 	= [];
			var values 			= [];
			
			for (var key in this.data) {
				matchingKeys.push(key);
				
				switch(typeof this.data[key]) {
					case 'string':
						values.push("\"" + this.data[key] + "\"");
						break;
						
					default:
						values.push(this.data[key]);
						break;
				}
			}
			
			var wheres = [];
			
			for (var i = 0; i < matchingKeys.length; i++) {
				var key = matchingKeys[i];
				var val = values[i];
				var kv  = key + " = " + val;
				wheres.push(kv);
			}
			
			whereStatement = wheres.join(", ");			
			
			if (typeof columns == "string" && columns == "*") {
				var query = "select * from `" + this.table + "` where " + whereStatement + ";"
			}
			
			else {
				var query = "select (" + columns.join(", ") + ") from `" + this.table + "` where " + whereStatement + ";"
			}
			
			var query = "update `" + this.table + "` set " whereStatement
		},
		
		delete: function(callback) {
			P.modelTypes["mysql"]._pre();
		},
		
		query: function(query, callback) {
			
		}
	}
*/
    P.modelTypes["mongojs"] = {
        create: function(callback) {
            if (P.db === undefined) {
                P.log.error("P.db is not defined. Please define P.db as a MongoJS connection, preferrably in app.js");
                P.log.error("Example:\tP.db = P.lib(\"p/mongo\").connect([\"" + this.collection + "\"]);");
                return;
            }

            if (this.collection === undefined) {
                P.log.error("Model collection not defined. Please make sure you've specified this.collection in every automatic model.");
                return;
            }

            var $this = this;

            P.db[this.collection].insert(this.data, function(error, results) {
                if (!error) $this.data = results;
                if (callback) callback(error, results);
            });
        },

        read: function(callback) {
            if (P.db === undefined) {
                P.log.error("P.db is not defined. Please define P.db as a MongoJS connection, preferrably in app.js");
                P.log.error("Example:\tP.db = P.lib(\"p/mongo\").connect([\"" + this.collection + "\"]);");
                return;
            }

            if (this.collection === undefined) {
                P.log.error("Model collection not defined. Please make sure you've specified this.collection in every automatic model.");
                return;
            }

            var $this = this;

            P.db[this.collection].find(this.data, function(error, results) {
                if (!error) $this.data = results;
                if (callback) callback(error, results);
            });
        },

        update: function(callback) {
            if (P.db === undefined) {
                P.log.error("P.db is not defined. Please define P.db as a MongoJS connection, preferrably in app.js");
                P.log.error("Example:\tP.db = P.lib(\"p/mongo\").connect([\"" + this.collection + "\"]);");
                return;
            }

            if (this.collection === undefined) {
                P.log.error("Model collection not defined. Please make sure you've specified this.collection in every automatic model.");
                return;
            }

            var $this = this;

            P.db[this.collection].save(this.data, function(error, results) {
                if (!error) $this.data = results;
                if (callback) callback(error, results);
            });
        },

        delete: function(callback) {
            if (P.db === undefined) {
                P.log.error("P.db is not defined. Please define P.db as a MongoJS connection, preferrably in app.js");
                P.log.error("Example:\tP.db = P.lib(\"p/mongo\").connect([\"" + this.collection + "\"]);");
                return;
            }

            if (this.collection === undefined) {
                P.log.error("Model collection not defined. Please make sure you've specified this.collection in every automatic model.");
                return;
            }

            var $this = this;

            P.db[this.collection].remove(this.data, function(error, results) {
                if (!error) $this.data = results;
                if (callback) callback(error, results);
            });
        }
    };



	P.model = function(model_name) {
		var Model 		= require('../app/models/' + model_name),
		modelInstance 	= new Model(P);
		
		if (modelInstance === undefined) {
			P.log.error(model_name + " is not a valid model. Double check app/models/ " + model_name + ".js");
			return;
		}

        if (modelInstance.automatic === true) {
            if (P.modelTypes[modelInstance.type]) {
                if (!modelInstance.create)  modelInstance.create = P.modelTypes[modelInstance.type].create;
                if (!modelInstance.read)    modelInstance.read = P.modelTypes[modelInstance.type].read;
                if (!modelInstance.update)  modelInstance.update = P.modelTypes[modelInstance.type].update;
                if (!modelInstance.delete)  modelInstance.delete = P.modelTypes[modelInstance.type].delete;
            }

            else {
                P.log.warning(model_name + " does not utilize a valid model type. " + modelInstance.type + " is invalid.");
            }
        }

        else {
            // Check for required methods
            if (modelInstance.create === undefined)
                P.log.warning(model_name + " does not implement the create function.");

            if (modelInstance.read === undefined)
                P.log.warning(model_name + " does not implement the read function.");

            if (modelInstance.update === undefined)
                P.log.warning(model_name + " does not implement the update function.");

            if (modelInstance.delete === undefined)
                P.log.warning(model_name + " does not implement the delete function.");

        }
		
		return modelInstance;
	};
	
	P.mongoDB = function(mongodb) {
		if (typeof mongodb !== 'undefined') {
			P._mongoDB = mongodb;
		}
		
		else {
			return P._mongoDB;
		}
	};
};
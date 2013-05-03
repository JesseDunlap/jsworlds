module.exports = function(P) {
	var Map = require("../../lib/jsw/Map");
	var $this = this;
	
	this.index = function() {
		var $this = this;

		setInterval(function() {
			$this.saveMaps();
		}, 1000);
	};

	this.tileChanged = function(data) {
        P.socket.emit("tile", data);

		P.clients.forEach(function(client) {
            if (client != P)
			    client.socket.emit("tile", data);
		});
	};

	this.edit = function() {
		P.view("map/edit");
	};
	
	this.getMap = function(mapID) {
		global.maps[mapID] = global.maps[mapID] || Map.generateNewMap(mapID);
		global.maps[mapID].off("changed-tile", $this.tileChanged);
		global.maps[mapID].on("changed-tile", $this.tileChanged);
		
		return require("superserialize").serialize({
			id: 			mapID,
            name:           global.maps[mapID].name,
            alignment:      global.maps[mapID].alignment,
            description:    global.maps[mapID].description,
			tiles: 			global.maps[mapID].tiles,
			music:  	 	global.maps[mapID].music,
			startLocation: 	global.maps[mapID].startLocation,
			
			getTile: function(layer, x, y) {
				return this.tiles[layer][x][y];
			}
		});
	};

	this.setTile = function(data) {
		var mapID = data.map;
		var x     = data.x;
		var y     = data.y;
		var layer = data.layer;
		var tile  = data.tile;

		global.maps[mapID].setTile(x, y, layer, tile);
	}

	this.loadMaps = function(callback) {
		global.maps = global.maps || [];

		P.db.maps.find({}, function(error, maps) {
			maps.forEach(function(m) {
				var map = new Map();
				map.fromJSON(m);
				global.maps[map.id] = map;

				map.on("changed-tile", $this.tileChanged);
			});

			if (callback) callback(maps);
		});
	};

	this.saveMaps = function() {
		for (var id in global.maps) {
			var map = global.maps[id];
			P.db.maps.save(map);
		}
	};

    this.setDetails = function(mapData) {
        var id = mapData.id;

        for (var key in mapData) {
            if (key !== 'id')
                global.maps[id][key] = mapData[key];
        }

        P.clients.forEach(function(client) {
            client.socket.emit("map-details-changed", mapData);
        });

        $this.saveMaps();
    };
};
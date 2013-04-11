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
		P.globe.maps[mapID] = P.globe.maps[mapID] || Map.generateNewMap(mapID);
		P.globe.maps[mapID].off("changed-tile", $this.tileChanged);
		P.globe.maps[mapID].on("changed-tile", $this.tileChanged);
		
		return require("superserialize").serialize({
			id: 			mapID,
            name:           P.globe.maps[mapID].name,
            alignment:      P.globe.maps[mapID].alignment,
            description:    P.globe.maps[mapID].description,
			tiles: 			P.globe.maps[mapID].tiles,
			music:  	 	P.globe.maps[mapID].music,
			startLocation: 	P.globe.maps[mapID].startLocation,
			
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

		P.globe.maps[mapID].setTile(x, y, layer, tile);
	}

	this.loadMaps = function(callback) {
		P.globe.maps = P.globe.maps || [];

		P.db.maps.find({}, function(error, maps) {
			maps.forEach(function(m) {
				var map = new Map();
				map.fromJSON(m);
				P.globe.maps[map.id] = map;

				map.on("changed-tile", $this.tileChanged);
			});

			if (callback) callback(maps);
		});
	};

	this.saveMaps = function() {
		for (var id in P.globe.maps) {
			var map = P.globe.maps[id];
			P.db.maps.save(map);
		}
	};

    this.setDetails = function(mapData) {
        var id = mapData.id;

        for (var key in mapData) {
            if (key !== 'id')
                P.globe.maps[id][key] = mapData[key];
        }

        P.clients.forEach(function(client) {
            client.socket.emit("map-details-changed", mapData);
        });

        $this.saveMaps();
    };
};
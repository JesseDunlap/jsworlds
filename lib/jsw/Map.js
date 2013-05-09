/**
 * TileLayer constants, which represent the built in layers available for tiles. By specifying a custom
 * number between the default layers, you can order tiles in a more advanced way.
 *
 * NOTE: Layer 10 (Animated) will be hard-coded to blink by the client, allowing for a second, animated
 * 	     sprite to exist underneath, to give the illusion of some kind of movement or animation.
 */
var TileLayer = {
	Background: 0,
	Player:     5,
	Animated:   10,			// Layer 10 will be hard-coded in the client to flash on and off, allowing for animation
	Overhang:   15
};

/**
 * MapAlignment constants, which represent different map alignments.
 *
 * @param       Peaceful        Players cannot engage each other. Players cannot engage NPCs. NPCs cannot engage players.
 * @param       Dangerous       NPCs can engage players. Players can engage NPCs. Players cannot engage each other.
 * @param       Lawless         Everything goes. Players can attack each other. NPCs can attack players. Players can attack NPCs.
 */
var MapAlignment = {
    Peaceful:   0,
    Dangerous:  5,
    Lawless:    10
};

/**
 * Represents a Map, or a series of tiles as well as various media and ambiance information in the game.
 * Players can move freely within maps, translating between tiles, and they can be teleported to other maps
 * either to a default position specified by the map, or a custom position specified by the teleporter.
 */
var Map = function() {
    this.title          = "";                   // The map's tile, which is displayed at the top of the screen
    this.alignment      = MapAlignment.Peaceful;// The map's alignment, which determines how NPCs and players can interact
	this.tiles 			= {};					// Tile Object, which is organized by Layer, then an X, Y dual array. (this.tiles[layer][x][y])
	this.music			= "";					// Background music file, which will begin playing on a loop when the player enters the map
	this.startLocation	= { x: 0, y: 0 };		// Default start location, in the event the player teleports in without a target
	this.players 		= []; 					// A list of objects which contain an X and Y coordinate, and a corresponding Player.

	this.events 		= {};
};

/**
 * Adds an event listener, corresponding to a string event, with a callback.
 *
 * @param		e 				The name of the event you want to listen for.
 * @param 		callback 		The callback function which will be triggered.
 */

Map.prototype.on = function(e, callback) {
	global.on(e, callback);
	this.events[e] = this.events[e] || [];
	this.events[e].push(callback);
};

/**
 * Removes a specific event listener, or every listener for an event.
 *
 * @param 		e          	The name of the event you wish to remove.
 * @param 		callback 	The specific callback you want to remove (instead of all of them).
 */
Map.prototype.off = function(e, callback) {
	global.off(e, callback);
	this.events[e] = this.events[e] || [];

	if (callback)
		this.events[e].splice(this.events[e].indexOf(callback), 1);
	else
		this.events[e] = [];
};

/**
 * Triggers a specified event.
 *
 * @param 		e 				The name of the event you wish to trigger.
 * @param 		data 			Any data you wish to pass to the associated callbacks.
 */
Map.prototype.emit = function(e, data) {
	global.emit(e, data);
	this.events[e] = this.events[e] || [];
	this.events[e].forEach(function(cb) { cb(data) });
};

/**
 * Sets the tile ID at a specified X and Y position on a specified layer.
 * Emits the "changed-tile" event upon tile changes.
 *
 * @param		x 		The X coordinate (represented in tiles, not pixels)
 * @param		y 		The Y coordinate (represented in tiles, not pixels)
 * @param 		layer 	The layer on which the tile should be added, which comes from Map.TileLayer, or a custom integer level.
 * @param 		tile 	The tile ID which should exist at the specified location.
 *
 * @emits 		"changed-tile" 		Emitted when a tile changes on the map. Provides an object containing the X, Y, and Layer, as well as the new ID.
 *
 * @todo 		Implement an emissions system, and implement the "changed-tile" emitter.
 */
Map.prototype.setTile = function(x, y, layer, tile, specialAttributes, silenceEmit) {
	specialAttributes			= specialAttributes || [];
	
	this.tiles[layer]			= this.tiles[layer] || [];
	this.tiles[layer][x] 		= this.tiles[layer][x] || [];
	this.tiles[layer][x][y]		= [tile, specialAttributes];

	if (silenceEmit !== true)
		this.emit("changed-tile", { map: this, x: x, y: y, layer: layer, tile: this.tiles[layer][x][y] });
};


/**
 * Gets the tile ID at a specified position, in a specified layer.
 *
 * @param 		int x 		The X coordinate
 * @param 		int y 		The Y coordinate
 * @param 		int layer 	The layer on which the tile exists. This should correspond to a Map.TileLayer constant, or be a custom, valid integer level.
 *
 * @return 		int tile 	The tile ID, or 0 if no tile exists at the location specified.
 */
Map.prototype.getTile = function(x, y, layer) {
	this.tiles[layer]			= this.tiles[layer] || [];
	this.tiles[layer][x] 		= this.tiles[layer][x] || [];
	return this.tiles[layer][x][y] || 0;
};


/**
 * Adds a player to the map, and sends the "player-entered" emission which contains
 * the newly added player, and an X and Y coordinate.
 *
 * @param 		Player player 		The player to add to the map
 * @param 		[Object location] 	Optional location to place the player at when they enter the map. If not specified, the Maps default start location will be used.
 *
 * @emits 		"player-entered" 	Emitted when a player enters the Map. Provides the player, as well as the X and Y coordinate they entered at.
 */
Map.prototype.addPlayer = function(player, location) {
	if (this.findPlayer(player) === false) {
		location = location || this.startLocation;
		this.players.push({ player: player, location: location });
		this.emit("player-entered", { x: location.x, y: location.y, player: player });
	}
};

/**
 * Sets the position of a player on the map. Emits the "player-moved" event.
 *
 * @param 		Player player 		The player to reposition
 * @param 		Object location 	The new location to set the player at.
 *
 * @emits 		"player-moved" 		Emitted when a player moves. Provides the player, as well ast he X and Y coordinates of the old position, and the new position.
 */
Map.prototype.setPlayerPos = function(player, position) {
	var player = this.findPlayer(player);
	if (!player) return;

	var oldPos = { x: player.x, y: player.y };
};


/**
 * Returns a corresponding Map Player (position & player) when given a Player, or returns
 * false if the player does not exist on the map.
 *
 * @param 		Player player 		The player to attempt to find.
 */
Map.prototype.findPlayer = function(player) {
	this.players.forEach(function(mp) {
		if (mp.player === player) return player;
	});

	return false;
};

/**
 * Converts the map into a JSON structure, allowing it to be saved in a database
 */
Map.prototype.toJSON = function() {
	return {
		id: 			this.id,
		tiles: 			this.tiles,
		music: 			this.music,
		startLocation: 	this.startLocation
	};
};

/**
 * Parses a JSON structure and configures the Map instance's data to match it.
 */
Map.prototype.fromJSON = function(json) {
	this.id = json.id;
	this.tiles = json.tiles;
	this.music = json.music;
	this.startLocation = json.startLocation;

    for (var key in json) {
        this[key] = json[key];
    }
};


/**
 * The Map Object
 */
module.exports				= Map;

/**
 * A set of TileLayer constants
 */
module.exports.TileLayer	= TileLayer;

/**
 * Specifies the width, in tiles, of a map.
 */
module.exports.MAP_WIDTH 	= 20;

/**
 * Specifies the height, in tiles, of a map.
 */
module.exports.MAP_HEIGHT 	= 15;


module.exports.generateNewMap = function(id) {
	var map = new Map();
	
	map.id 	= id;
	
	for (var x = 0; x < module.exports.MAP_WIDTH; x++) {
		for (var y = 0; y < module.exports.MAP_HEIGHT; y++) {
			map.setTile(x, y, TileLayer.Background, 1, [], true);
			map.setTile(x, y, TileLayer.Player, 0, [], true);
			map.setTile(x, y, TileLayer.Animated, 0, [], true);
			map.setTile(x, y, TileLayer.Overhang, 0, [], true);
		}
	}

	return map;
};
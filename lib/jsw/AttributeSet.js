var AttributeSet = function() {
	this.stamina		=	20;
	this.mana			=	20;
	this.hp				=	20;
	this.hunger			=	20;
};

AttributeSet.Greater = 1;
AttributeSet.Lesser  = -1;
AttributeSet.Equal   = 0;
AttributeSet.Invalid = -2;


AttributeSet.prototype.compare = function(skill, otherAttributeSet) {
	if (this[skill] === undefined || otherAttributeSet[skill] === undefined) return AttributeSet.Invalid;

	if (this[skill] > otherAttributeSet[skill]) 		return AttributeSet.Greater;
	else if (this[skill] < otherAttributeSet[skill]) 	return AttributeSet.Lesser;
	else if (this[skill] == otherAttributeSet[skill])	return AttributeSet.Equal;
};

AttributeSet.prototype.toJSON = function() {
	var jsonifiedVersionOfThisObject = {};

	for (var key in this) {
		if (typeof this[key] !== 'function') {
			jsonifiedVersionOfThisObject[key] = this[key];
		}
	}

	return jsonifiedVersionOfThisObject;
};

AttributeSet.prototype.fromJSON = function(jsonifiedVersion) {
	for (var key in jsonifiedVersion) {
		this[key] = jsonifiedVersion[key];
	}
};

module.exports = AttributeSet;
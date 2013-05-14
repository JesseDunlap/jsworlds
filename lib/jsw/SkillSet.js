var SkillSet = function() {
	this.attack			=	1;
	this.defense		=	1;
	this.intelligence	=	1;
	this.survival		=	10;
	this.stamina		=	20;
	this.mana			=	20;
	this.hp				=	20;
};

SkillSet.Greater = 1;
SkillSet.Lesser  = -1;
SkillSet.Equal   = 0;
SkillSet.Invalid = -2;


SkillSet.prototype.compare = function(skill, otherSkillSet) {
	if (this[skill] === undefined || otherSkillSet[skill] === undefined) return SkillSet.Invalid;

	if (this[skill] > otherSkillSet[skill]) 		return SkillSet.Greater;
	else if (this[skill] < otherSkillSet[skill]) 	return SkillSet.Lesser;
	else if (this[skill] == otherSkillSet[skill])	return SkillSet.Equal;
};

SkillSet.prototype.toJSON = function() {
	var jsonifiedVersionOfThisObject = {};

	for (var key in this) {
		if (typeof this[key] !== 'function') {
			jsonifiedVersionOfThisObject[key] = this[key];
		}
	}

	return jsonifiedVersionOfThisObject;
};

SkillSet.prototype.fromJSON = function(jsonifiedVersion) {
	for (var key in jsonifiedVersion) {
		this[key] = jsonifiedVersion[key];
	}
};

module.exports = SkillSet;
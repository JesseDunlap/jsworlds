/**
 * FormValidator
 * Implements various classes and functions for validating user input from forms
 */

var Rules = {
	MaxLength: 				"max-length",
	MinLength: 				"min-length",
	OnlyLetters: 			"alpha",
	OnlyNumbers: 			"numeric",
	Alphanumeric: 			"alphanumeric",
	Disallowed: 			"disallowed",
	Custom: 				"custom"
};


var FormValidator = function(data, rules) {
	this.rules			=	(rules === undefined) ? {} : rules;
	this.data			=	(data === undefined) ? {} : data;
};

FormValidator.prototype.addRule = function(field, rule, val) {
	if (this.rules[field] === undefined) this.rules[field] = [];
	
	var newRule = {
		name: 	rule,
		func: 	function(value) {},
		value: 	val
	};
	
	if (rule == "max-length") {
		newRule.func = function(rule, test) {
			return (test.length <= parseInt(rule));
		};
	}
	
	else if (rule == "min-length") {
		newRule.func = function(rule, test) {
			return (test.length >= parseInt(rule));
		};
	}
	
	else if (rule == "alpha") {
		newRule.func = function(rule, test) {
			return true;
		};
	}
	
	else if (rule == "numeric") {
		newRule.func = function(rule, test) {
			return true;
		};
	}
	
	else if (rule == "alphanumeric") {
		newRule.func = function(rule, test) {
			return true;
		};
	}
	
	else if (rule == "disallowed") {
		newRule.func = function(rule, test) {
			rule.forEach(function(check) {
				if (test.replace(check, "") != test) return false;
			});
			
			return true;
		};
	}
	
	else if (rule == "custom") {
		newRule.func = rule.value;
	}
	
	this.rules[field].push(newRule);
};

FormValidator.prototype.validate = function() {
	var $this = this;
	
	var result = {
		validates: true,
		issues: []
	};
	
	for (var key in data) {
		var value = data[key];

		if (this.rules[key] !== undefined) {
			for (var i = 0; i < this.rules[key].length; i++) {
				var rule = this.rules[key][i];
				
				if (rule.func(rule.value, value) == false) {
					result.validates = false;
					result.issues.push({ field: key, value: value, rule: rule });
				}
			}
		}
	}
	
	return result;
};

module.exports 			= FormValidator;
module.exports.Rules 	= Rules;
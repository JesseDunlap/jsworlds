/**
 * Element
 * Implements the Element funcitonality of P
 */

var jw = require('../lib/hydrais/p/watch.old.js');

var Element = function(selector, P) {
	this.content 			=	"";
	this.css 				=	{};
	this.attributes 		=	{};

	jw.watch(this, ["content", "css", "attributes"], function(e) {
		if (e === "content")
			$this.text($this.content);
		if (e === "css")
			$this.css($this.css);
		if (e === "attributes")
			$this.attr($this.attributes);
	});
	
	var $this		=	this;
	$this.selector	=	selector;
	
	$this.jq = function(method, data) {
		P.socket.emit("jq", {
			type: 		"call",
			selector: 	$this.selector,
			method: 	method,
			args: 		data
		});
		
		return $this;
	};
	
	/////////////////////////////////////////////
	// Utility Methods
	/////////////////////////////////////////////
	
	this.child = function(selector)
	{
		return new Element($this.selector + " > " + selector, P);
	};
	
	this.$ = this.child;
	
	this.addClass = function(c)
	{
		$this.jq("addClass", [c]);
		return $this;
	};
	
	this.animate = function(animation)
	{
		$this.jq("animate", [animation]);
		return $this;
	};
	
	this.append = function(content)
	{
		$this.jq("append", [content]);
		return $this;
	};
	
	this.appendTo = function(element)
	{
		$this.jq("appendTo", [element]);
		return $this;
	};
	
	this.attr = function(attributes)
	{
		$this.jq("attr", [attributes]);
		return $this;
	};
	
	this.before = function(before)
	{
		$this.jq("before", [before]);
		return $this;
	};
	
	this.blur = function()
	{
		$this.jq("blur", []);
		return $this;
	};
	
	this.disable = function()
	{
		$this.jq("disable", []);
		return $this;
	};	
	
	this.remove = function()
	{
		this.jq("remove", []);
		return $this;
	};
	
	this.click = function()
	{
		this.jq("click", []);
		return $this;
	};
	
	this.clone = function()
	{
		this.jq("clone", []);
		return $this;
	};
	
	this.css = function(css_args)
	{
		$this.jq("css", [css_args]);
		return $this;
	};
	
	this.empty = function()
	{
		$this.jq("empty", []);
		return $this;
	};
	
	this.fadeIn = function(speed)
	{
		$this.jq("fadeIn", [speed]);
		return $this;
	};
	
	this.fadeOut = function(speed)
	{
		$this.jq("fadeOut", [speed]);
		return $this;
	};
	
	this.fadeToggle = function(speed)
	{
		$this.jq("fadeToggle", speed);
		return $this;
	};
	
	this.focus = function()
	{
		$this.jq("focus", []);
		return $this;
	};
	
	this.hide = function()
	{
		$this.jq("hide", []);
		return $this;
	};
	
	this.html = function(html)
	{
		$this.jq("html", [html]);
		return $this;
	};
	
	this.keydown = function()
	{
		$this.jq("keydown", []);
		return $this;
	};
	
	this.keypress = function()
	{
		$this.jq("keypress", []);
		return $this;
	};
	
	this.keyup = function()
	{
		$this.jq("keyup", []);
		return $this;
	};
	
	this.mousedown = function()
	{
		$this.jq("mousedown", []);
		return $this;
	};
	
	this.mouseenter = function()
	{
		$this.jq("mouseenter", []);
		return $this;
	};
	
	this.mouseleave = function()
	{
		$this.jq("mouseleave", []);
		return $this;
	};
	
	this.mousemove = function()
	{
		$this.jq("mousemove", []);
		return $this;
	};
	
	this.mouseout = function()
	{
		$this.jq("mouseout", []);
		return $this;
	};
	
	this.mouseover = function()
	{
		$this.jq("mouseover", []);
		return $this;
	};
	
	this.mouseup = function()
	{
		$this.jq("mouseup", []);
		return $this;
	};
	
	this.prepend = function(contents)
	{
		$this.jq("prepend", [contents]);
		return $this;
	};
	
	this.prependTo = function(element)
	{
		$this.jq("prependTo", [element]);
		return $this;
	};
	
	this.remove = function()
	{
		$this.jq("remove", []);
		return $this;
	};
	
	this.removeAttr = function(attr)
	{
		$this.jq("removeAttr", [attr]);
		return $this;
	};
	
	this.removeClass = function(data)
	{
		$this.jq("removeClass", [data]);
		return $this;
	};
	
	this.removeData = function(data)
	{
		$this.jq("removeData", [data]);return $this;
	};
	
	this.resize = function()
	{
		$this.jq("resize", []);
		return $this;
	};
	
	this.scroll = function()
	{
		$this.jq("scroll", []);
		return $this;
	};
	
	this.select = function()
	{
		$this.jq("select", []);
		return $this;
	};
	
	this.show = function()
	{
		$this.jq("show", []);
		return $this;
	};
	
	this.slideDown = function(s)
	{
		$this.jq("slideDown", [s]);
		return $this;
	};
	
	this.slideToggle = function(s)
	{
		$this.jq("slideToggle", [s]);
		return $this;
	};
	
	this.slideUp = function(s)
	{
		$this.jq("slideUp", [s]);
		return $this;
	};
	
	this.stop = function()
	{
		$this.jq("stop", []);
		return $this;
	};
	
	this.submit = function()
	{
		$this.jq("submit", []);
		return $this;
	};
	
	this.val = function(t)
	{
		$this.jq("val", [t]);
		return $this;
	};
	
	this.text = function(t)
	{
		$this.jq("html", [t]);
		$this.jq("val", [t]);
		return $this;
	};
	
	this.on = function(listener, callback)
	{
		var cb = "el-on-" + require('node-uuid').v4();
		P.on(cb, callback);
		
		P.emit("jq", {
			type:     	"on",
			selector: 	$this.selector,
			event: 		listener,
			callback: 	cb
		});
		
		return $this;
	};

    this.trigger = function(trigger)
    {
        $this.jq("trigger", [trigger]);
		return $this;
    };
	
	this.render = function(view_name, options)
	{
		if (!options) options = {};
		options.P = P;
		
		$this.html(P.snippet(view_name, options));
		
		return $this;
	};
	
	this.bind = function(view_name, options)
	{
		options.change(function(data) {
			$this.render(view_name, options);
		});
		
		$this.render(view_name, options);
	};
};


var ElementModule = function(P) {
	P.dependOn("View");
	
	P.element = function(selector) {
		return new Element(selector, P);
	};

	P.$ = P.element;
};

module.exports = ElementModule;
module.exports.Element = Element;
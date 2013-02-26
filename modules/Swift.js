/**
 * Swift UI
 * Allows you to create nice user interface elements using P
 */

exports.autoload = false;

exports.module = function(P) {
	var Component = function() {
		this.uuid 			=	"swift" + require('node-uuid').v4();
		
		while (this.uuid.replace("-", "") !== this.uuid)
			this.uuid = this.uuid.replace("-", "");
			
		this.children 		=	[];

		/**
		 * create the element on the page with a unique ID
		 */
		var initialHTML					 	=	"<div id='" + this.uuid + "'></div>";
		P.$('body').append(initialHTML);
		this.element				 		=	P.$('#' + this.uuid);

		this.setContent = function(content) {
			this.content = content;
			this.element.html(this.content);
		};

		this.render = function(view, options) {
			this.setContent(P.snippet(view, options));
		};

		this.addChild = function(component) {
			if (component.parent !== undefined && component.parent !== this)
				component.parent.removeChild(component);

			component.parent = this;

			if (this.children.indexOf(component) == -1)
				this.children.push(component);
		};

		this.removeChild = function(component) {
			if (this.children.indexOf(component) != -1)
				this.children = this.children.splice(this.children.indexOf(component), 1);
		};
	};

	var Window = function(options) {
		P.extend(this, new Component());

		if (options === undefined) options = {};

		this.options 		=	options;
		this.title 			=	"Untitled";
		this.element.addClass("swiftWindow");

		options.title 		= 	this.title;
		this.element.render("lib/p/swift/views/window.ejs", options);

		this.setContent = function(content) {
			this.element.$('.content').html(content);
		};

		this.setTitle = function(title) {
			this.title = title;
			this.element.$('.title').html(title);
		}

		this.render = function(view, options) {
			this.element.$('.content').render(view, options);
		};

		this.setSize = function(width, height, animate) {
			if (animate == true)
				this.element.animate({ 'height': height, 'width': width });
			else
				this.element.css({ 'height': height, 'width': width });
		};

		this.center = function() {
			this.element.jq("center", []);
		};

		this.render = function(view_name, options) {
			this.element.$('.content').render(view_name, options);
		};

		this.close = function() {
			var $this = this;
			this.element.animate({"opacity": "0.0", "marginTop": "1000px"}, 200);

			setTimeout(function() {
				$this.element.remove();
			}, 210);
		};
	};

	P.swift = {
		component: 		Component,
		window: 		Window,

		init: 			function() {
			P.view("lib/p/swift/views/init.ejs");
		}
	};
};
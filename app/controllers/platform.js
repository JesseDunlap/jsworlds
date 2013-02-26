/**
 * Platform Controller
 * Controls and handles the "P Platform", which allows you to edit and collaborate
 * on developing your P application *through* the application.
 *
 * It is recommended that you disable the Platform before production, by setting the
 * platormEnabled variable to false in config/environment.js
 */

module.exports = function(P) {
  	if (P.config.platformEnabled == false) return;
  
	this.show = function() {
		P.$('#platform').remove();
		P.view("lib/p/platform/views/index.ejs");
		this.cd(".");
	};
	
	this.change = function(data) {
		P.clients.forEach(function(client) {
			if (client != P)
				client.socket.emit("platform-editor-changed", data);
		});
	};

	this.hide = function() {
		P.$('#platform').remove();
	};

	this.save = function(file) {
		try {
			file.name.replace("./", "");
			require('fs').writeFileSync(file.name, file.contents);
			return true;
		}

		catch (e) {
			return false;
		}
	};

	this.cd = function(dir, options) {
		if (options === undefined) options = {};

		var files		=	[];
		var dirs		=	[];
		var all			=	require('fs').readdirSync(dir);

		all.forEach(function(file) {
			if (file.substr(0, 1) == "." && options.hiddenFiles != true) return;

			var stats = require('fs').statSync(dir + "/" + file);

			if (stats.isDirectory())
				dirs.push(file);
			else
				files.push(file);
		});

		P.$('#platformFileView').render("lib/p/platform/views/files.ejs", { files: files, dirs: dirs, path: dir });
	};

	this.up = function(path) {
		var parts = path.split("/");
		parts.splice(parts.length - 1, 1);
		this.cd(parts.join("/"));
	};

	this.edit = function(file) {
		P.socket.emit("platform-edit-file", { name: file, contents: require('fs').readFileSync(file).toString() });
	};
};
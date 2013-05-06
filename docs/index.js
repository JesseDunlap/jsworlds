if (process.argv[2] == "serve") {
	var connect = require("connect");
	
	connect.createServer(
        connect.static(__dirname + "/build/")
    ).listen(9999, "0.0.0.0");

	console.log("Connect webserver listening at http://%s:%d", "0.0.0.0", 9999);
}

else {

	var	md				=	require('node-markdown').Markdown,
		ejs 			=	require('ejs'),
		wrench			=	require('wrench'),
		fs				=	require('fs');

	var Milo = {
		// Syntax:
		// @milo-property:value
		// @milo-property:value1=test,value2=test
		parse: function(file, config) {
			var hotlinks = Milo.handleMiloCodeHotlinks(file);
			var file = hotlinks.contents;

			var lines = file.split("\n");
			var obj   = {};

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].replace("@milo-", "") != lines[i]) {
					lines[i] = lines[i].replace("@milo-", "");
					var parts = lines[i].split(":");

					if (parts.length > 1) {
						if (parts[1].replace(",", "") != parts[1]) {
							var value = {};
							var args = parts[1].split(",");

							args.forEach(function(arg) {
								arg = arg.trim();
								var argParts = arg.split(",");

								var key = argParts[0].trim();
								var val = (argParts[1]) ? argParts[1].trim() : "";

								value[key] = val;
							});
						}

						else {
							var value = parts[1];
						}
					}

					else {
						var value = "";
					}

					obj[parts[0]] = value;
				}
			}

			return { contents: Milo.stripMiloTags(file), data: obj, hotlinks: hotlinks.hotlinks };
		},

		handleMiloCodeHotlinks: function(file) {
			var hotlinks = [];
			var lines = file.split("\n");

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].replace("@milo-scrollCode", "") != lines[i]) {
					var id = "a" + Math.floor(Math.random() * 9999);
					var line = lines[i].replace("@milo-scrollCode:", "");
					var prompt = "Show Me";
					
					if (line.split(",").length > 1) {
						var parts = line.split(",");
						line = parseInt(parts[0]);
						prompt = parts[1];
					}
					
					else {
						line = parseInt(line);
					}
					
					hotlinks.push({ id: id, line: line });

					if (prompt == "hidden")
						lines[i] = "<div id='" + id + "'></div>";
					else
						lines[i] = "<div id='" + id + "' class='primary btn hotlink'><a onMouseOver='jumpToLine(" + line + ")' href='javascript:jumpToLine(" + line + ");'>" + (prompt || "Show Me") + "</a></div>";
				}
			}

			return { contents: lines.join("\n"), hotlinks: hotlinks };
		},

		stripMiloTags: function(file) {
			var lines = file.split("\n");

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].replace("@milo-", "") != lines[i])
					delete lines[i];
			}

			return lines.join("\n");
		}
	};

	console.log("==================================================");
	console.log("Milo is compiling your documentation...");
	console.log("==================================================");
	console.log("");

	/**
	 * Remove the old "build" directory, if it exists, and then create
	 * a new, empty build directory for the new documentation files.
	 */
	if (fs.existsSync("build") && fs.statSync("build").isDirectory())
		wrench.rmdirSyncRecursive("build");

	fs.mkdirSync("build");


	/**
	 * Let's make sure there is a valid layout.ejs file in the pages
	 * directory before we continue. If there isn't a layout.ejs, we
	 * should notify the user.
	 */

	if (!fs.existsSync("pages/layout.ejs")) {
		console.log(" | Uh oh!\n | There doesn't appear to be a \"layout.ejs\" file in the \"pages\" folder.\n | Please make one.");
		return;
	}

	/**
	 * Loop through every page found in the "pages" directory. First,
	 * pass them through the EJS engine, then through the Markdown parser
	 * and finally, pass the resulting output to the 'layout.ejs' file
	 * via EJS.
	 */

	var files = wrench.readdirSyncRecursive("pages");

	/**
	 * Build a navigation structure first
	 */
	var mainNavigation = {};

	files.forEach(function(file) {
		if (!fs.statSync("pages/" + file).isDirectory() && file != "layout.ejs") {
			var contents = fs.readFileSync("pages/" + file).toString();
			var miloData = Milo.parse(contents, require("./config"));
			contents     = miloData.contents;
			var lines    = contents.split('\n');

			contents     = lines.join('\n');
		
			var rendered = ejs.render(contents);
			var markdown = md(rendered);
			var filename = file.replace(".ejs", ".html");
			filename     = file.replace(".md", ".html");

			var layout   = fs.readFileSync("pages/layout.ejs").toString();

			var code = miloData.data.codefile.trim();
			code = fs.readFileSync(code).toString();

			var filenameParts = filename.split("/");
			filenameParts.pop();
			var navigationGroup = (filenameParts.length == 1) ? filenameParts[0] : "General";
		
			mainNavigation[navigationGroup] = mainNavigation[navigationGroup] || { items: [], title: navigationGroup };
			mainNavigation[navigationGroup].items.push({
				title: 		miloData.data.title,
				href: 		"/" + filename
			});
		}
	});

	files.forEach(function(file) {
		/**
		 * We want to ignore directories and "layout.ejs"
		 */
		if (!fs.statSync("pages/" + file).isDirectory() && file != "layout.ejs") {
			var contents = fs.readFileSync("pages/" + file).toString();
			var miloData = Milo.parse(contents, require("./config"));
			contents     = miloData.contents;
			var lines    = contents.split('\n');

			contents     = lines.join('\n');
		
			var rendered = ejs.render(contents);
			var markdown = md(rendered);
			var filename = file.replace(".ejs", ".html");
			filename     = file.replace(".md", ".html");

			var layout   = fs.readFileSync("pages/layout.ejs").toString();

			var code = miloData.data.codefile.trim();
			var lang = miloData.data.language.trim();
			code = fs.readFileSync(code).toString();

			var fullpage = ejs.render(layout, { 
				page: markdown, 
				title: miloData.data.title,
				description: miloData.data.description,
				keywords: miloData.data.keywords,
				code: code,
				config: require("./config"),
				hotlinks: miloData.hotlinks,
				navigation: mainNavigation,
				language: "language-" + (lang || "markup")
			});
		
			var filenameParts = filename.split("/");
			filenameParts.pop();
			var parentDirectory = "build/" + filenameParts.join("/");
			if (!fs.existsSync(parentDirectory)) wrench.mkdirSyncRecursive(parentDirectory);

			fs.writeFileSync("build/" + filename, fullpage);

			console.log(" * " + filename);
		}
	});


	/**
	 * The last thing to do is to copy the assets directory.
	 */
	wrench.copyDirSyncRecursive("assets", "build/assets");


	console.log("");
	console.log("==================================================");
	console.log("Alright, all done! Check out the 'build' folder!");
	console.log("==================================================");
	console.log("");
}
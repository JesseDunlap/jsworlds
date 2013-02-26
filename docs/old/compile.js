/**
 * A quick script to pass all of the docs through the EJS compiler
 * and output them to an output folder for upload to a site.
 */

var ejs			=	require('ejs'),
	fs			=	require('fs'),
	wrench		=	require('wrench');
	
var files		=	fs.readdirSync("./pages/");


wrench.rmdirSyncRecursive('./output/', true);
wrench.mkdirSyncRecursive('./output/', 0777);
wrench.copyDirSyncRecursive('foundation/', 'output/');

console.log("==============================================================");
console.log("Beginning Pre-processing of P Documentation...");
console.log("==============================================================\n");

files.forEach(function(file) {
	// check if the file is of type html or ejs
	if (file.split(".").length > 1 && (file.split(".")[1] == "htm" || file.split(".")[1] == "html" || file.split(".")[1] == "ejs")) {
		
		console.log("Processing " + file);
		var contents = ejs.render(fs.readFileSync("./pages/" + file).toString(), { filename: "./" });
		
		console.log("Saving to output/" + file.split(".")[0] + ".html\n");
		fs.writeFileSync("output/" + file.split(".")[0] + ".html", contents);
	}
});

console.log("==============================================================");
console.log("All Done!");
console.log("==============================================================\n");
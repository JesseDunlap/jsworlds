function generateModel(args) {
    var model_name      =   args[3];
    var model_type      =   args[2];

    var model_path      =   "app/models/" + model_name + ".js";

    switch (model_type) {
        case "mongojs":
            var collection_name = args[4];
            var contents =  "/**\n" +
                            " * " + model_name + " Model\n" +
                            " */\n" +
                            "\n" +
                            "module.exports = function(P) {\n" +
                            "\tthis.automatic = true;\n" +
                            "\tthis.type = \"mongojs\";\n" +
                            "\tthis.collection = \"" + collection_name.trim() + "\";\n" +
                            "\tthis.data = {};\n" +
                            "};";

            require("fs").writeFileSync(model_path, contents);
            console.log("Model generated at " + model_path);
            break;

        default:
            console.log("Invalid model type. Type \"help generate\".");
            break;
    }
};

function generateController(args) {
    var controller_name     =   args[2];
    var contents =  "/**\n" +
        " * " + controller_name.trim() + " Controller\n" +
        " */\n" +
        "\n" +
        "module.exports = function(P) {\n" +
        "\tthis.index = function() {\n" +
        "\t\t// index action\n" +
        "\t};\n" +
        "};";

    require("fs").writeFileSync("app/controllers/" + controller_name.trim() + ".js", contents);
    console.log("Controller generated at app/controllers/" + controller_name.trim() + ".js");
};

module.exports = function(command, args, clients) {
    if (command == "generate") {
        if (args.length == 1) {
            console.log("Invalid usage. Type \"help generate\".");
            return;
        }

        switch (args[1]) {
            case "model":
                generateModel(args);
                break;

            case "controller":
                generateController(args);
                break;

            case "view":
                generateView(args);
                break;

            default:
                console.log("Invalid generation type: \"" + args[1] + "\"");
        }
    }
};
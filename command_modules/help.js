/**
 * Command Line Help
 */

module.exports = function(command, args, clients) {
    if (command == "help") {
        if (args.length == 1)
            console.log(require("fs").readFileSync("docs/command_line/toc.txt").toString());
        else {
            if (require("fs").existsSync("docs/command_line/" + args[1] + ".txt")) {
                console.log(require("fs").readFileSync("docs/command_line/" + args[1] + ".txt").toString());
            }

            else {
                console.log("[Error]\tThat's not a valid help topic!");
            }
        }
    };
};
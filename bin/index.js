#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const createHTML = require("create-html");
const chalk = require("chalk");

// Get CLI arguments
const options = yargs
    .usage("Usage: -i <input>")
    .option("i", {
        alias: "input",
        describe: "File name",
        type: "string",
        demandOption: true,
    })
    .option("o", {
        alias: "output",
        describe: "Specify a different output directory",
        type: "string",
    }).argv;

// Output file name
const output = `Path of file or folder: ${options.input}`;
console.log(chalk.bgWhite(output));

// Create Directory
var dir;
if (options.output) {
    dir = options.output;
} else {
    dir = ".\\dist";
}

if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir);
} else if (!fs.existsSync(dir)) {
    console.log(chalk.blue(`New directory created: ${dir}`));
    fs.mkdirSync(dir);
}

// Read file and generate HTML
fs.readFile(options.input, (err, data) => {
    if (err) {
        if (err.code == "EISDIR") {
            fs.readdir(options.input, function (err, filenames) {
                if (err) {
                    console.log(err);
                    return;
                }
                filenames.forEach(function (filename) {
                    fs.readFile(
                        options.input + "\\" + filename,
                        "utf-8",
                        function (err, content) {
                            if (err) {
                                console.log(err);
                                return;
                            } else if (path.extname(filename) == ".txt") {
                                HTMLcreate(options.input + "\\" + filename, content.toString());
                            }
                        }
                    );
                });
            });
            return;
        }
        console.log(err);
        return;
    } else if (path.extname(options.input) != ".txt") {
        console.log(chalk.red.bold("Please select a text file."));
        return;
    }
    HTMLcreate(options.input, data.toString());
});

// HTML file creation
function HTMLcreate(filename, content) {
    var body = content.split("\n\r");
    var newBody =
        "<h1>" +
        filename.substring(filename.lastIndexOf("\\") + 1).split(".")[0] +
        "</h1>";

    body.forEach(function (line) {
        newBody += "<p>" + line + "</p>";
    });

    var html = createHTML({
        title: filename,
        body: newBody,
    });

    fs.writeFile(
        `${dir + "\\" + filename.substring(filename.lastIndexOf("\\") + 1).split(".")[0]
        }.html`,
        html,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    chalk.green.bold(
                        "HTML file created --> Path: " +
                        `${dir + "\\" + filename.substring(filename.lastIndexOf("\\") + 1).split(".")[0]
                        }.html`
                    )
                );
            }
        }
    );
}

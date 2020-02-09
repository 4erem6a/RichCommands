const {
  Parser,
  defaultParserOptions,
  createRichArgv
} = require("rich-commands");

/*
  If you want to have more control over the parser,
  you can use the Parser class directly.
*/

const source = "npm i -D typescript";

/*
  First, we need to create a parser instance.
  Unlike parseArgs and parseCommand, the parser constructor does not
  use parser options to override the default ones, so you need to explicitly specify all of them.
*/
const parser = new Parser(source, defaultParserOptions);

// Now we want to get the name of a command, so we use the string() rule.
const name = parser.string();

console.log(name); // npm

parser.skipSeparators(); // Skip all subsequent separators.

const subcommand = parser.string(); // Parse subcommand name.

console.log(subcommand); // i

const restParts = parser.commandParts(); // Parse the rest of the command as flags and arguments.

const argv = createRichArgv(restParts); // Create RichArgv object from raw command parts.

console.log(argv);
/* 
  {
    args: ["typescript"],
    flags: { D: true }
  }
*/

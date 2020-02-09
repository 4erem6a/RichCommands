const { parseCommand } = require("rich-commands");

const rawCommand = "npm i -D typescript";

/*
  Tries to parse a command using a command rule (command -> string commandPart*).
  If succeeded, returns the parsed command, otherwise returns null.
*/
const command = parseCommand(rawCommand);

console.log(command);

/*
  {
    name: "npm",
    args: ["i", "typescript"],
    flags: { D: true }
  }
*/

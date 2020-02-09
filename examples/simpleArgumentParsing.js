const { parseArgs } = require("rich-commands");

const rawArgs = '1 "2 3" -f = x';

// Parses the source string as command arguments.
const argv = parseArgs(rawArgs);

console.log(argv);
/*
  {
    args: ["1", "2 3"],
    flags: { f: "x" }
  }
*/

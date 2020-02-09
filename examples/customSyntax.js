const { parseArgs } = require("rich-commands");

/*
  In this example we want the parser to treat `begin` and `end` as a quote markers
  and disable the `~` empty argument syntax.

  To do so, we need to define our custom parser options:
*/
const parserOptions = {
  /*
    Treat `begin` and `end` as a quote markers.
    Note that default quote markers won't work because we've redefined this option.
  */
  quotes: [["begin", "end"]],
  // Disable empty argument markers.
  emptyArgMarkers: undefined
};

const rawArgs = "1 begin Hello, world! end ~ 2";

/*
  parseArgs and parseCommand functions use custom parser options to override the default ones,
  therefore, all unspecified options will be set by default. 
*/
const argv = parseArgs(rawArgs, parserOptions);

console.log(argv);
/*
  {
    args: ["1", " Hello, world! ", "~", "2"],
    flags: {}
  }
*/

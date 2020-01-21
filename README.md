# RichCommands

RichCommands is a simple, feature-rich and error-free command/argument parser.

[![npm version](https://badge.fury.io/js/rich-commands.svg)](https://www.npmjs.com/package/rich-commands)

[Documentation](https://4erem6a.github.io/RichCommands/)

## Features

- Simple API
- Fully configurable syntax
- Quoted arguments
- Rest arguments
- Escape markers
- Empty arguments (Argument skipping)
- Flags with optional values
- Array flag values

## Example

### Command parsing

```js
const { parseCommand } = require("rich-commands");

const rawCommand = "npm i -D typescript";

const command = parseCommand(rawCommand);

console.log(command);
```

Expected result:

```js
{
  name: "npm",
  args: ["i", "typescript"],
  flags: { D: true }
}
```

### Argument parsing

```js
const { parseArgs } = require("rich-commands");

const rawArgs = '1 "2 3" -f = x';

const argv = parseArgs(rawArgs);

console.log(argv);
```

Expected result:

```js
{
  args: ["1", "2 3"],
  flags: { f: "x" }
}
```

## Grammar

```
command     -> string commandPart*
commandPart -> argument | flag

argument    -> string | empty
flag        -> <FlagMarker> string [ <FlagValueMarker> argument ]

string      -> rest | quoted | simple

rest        -> <RestMarker> <any>*
quoted      -> <OpeningQuote> (<any> - <ClosingQuote>)* <ClosingQuote>
simple      -> (<any> - <Separators> - <OpeningQuotes>)+

empty       -> <EmptyArgMarker>
```

## Default syntax

```js
{
  quotes: ['"', ["(", ")"]],
  flagMarkers: ["--", "-"],
  flagValueMarkers: ["="],
  emptyArgMarkers: ["~"],
  escapeMarkers: ["\\"],
  separators: [" ", "\n", "\r", "\t"],
  restMarkers: ["::"]
}
```

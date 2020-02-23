<img src="https://badge.langauge.io/4erem6a/RichCommands" align="right" />

# RichCommands

[![npm version](https://badge.fury.io/js/rich-commands.svg)][npm]
[![downloads](https://img.shields.io/npm/dw/rich-commands)][npm]
[![build](https://travis-ci.org/4erem6a/RichCommands.svg?branch=master)][ci]
[![coverage](https://img.shields.io/coveralls/github/4erem6a/RichCommands)][coveralls]
[![licence](https://img.shields.io/github/license/4erem6a/RichCommands)][licence]

RichCommands is a simple, feature-rich and error-free command/argument parser. [[Documentation][docs]]

[npm]: https://www.npmjs.com/package/rich-commands
[docs]: https://4erem6a.github.io/RichCommands
[coveralls]: https://coveralls.io/github/4erem6a/RichCommands
[ci]: https://travis-ci.org/4erem6a/RichCommands
[licence]: https://github.com/4erem6a/RichCommands/blob/master/LICENSE

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

[[More examples](https://github.com/4erem6a/RichCommands/tree/master/examples)]

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

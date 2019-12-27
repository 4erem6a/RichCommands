# RichCommands

RichCommands is a simple, feature-rich and error-free command parser.

[![npm version](https://badge.fury.io/js/rich-commands.svg)](https://www.npmjs.com/package/rich-commands)

[Documentation](https://4erem6a.github.io/RichCommands/)

## Features

- Simple API
- Fully configurable syntax
- Quoted arguments
- Escape markers
- Empty arguments (Argument skipping)
- Flags with optional values
- Array flag values

## Example

```js
const { parse } = require("rich-commands");

const command = 'this -is=a "sample command"';

const result = parse(command);

console.log(result);
```

Expected result:

```js
{ args: [ 'this', 'sample command' ], flags: { is: 'a' } }
```

## Grammar

```
command     -> commandPart*
commandPart -> argument | flag

argument    -> string | empty
flag        -> <FlagMarker> string [ <FlagValueMarker> argument ]

string      -> rest | quoted | simple

rest        -> <RestMarker> <any>*
quoted      -> <OpeningQuote> (<any> - <ClosingQuote>)* <ClosingQuote>
simple      -> (<any> - <Separators> - <OpeningQuotes>)+
empty       -> <EmptyArgMarker>
```

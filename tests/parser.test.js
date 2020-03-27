const { parseCommand, parseArgs, Parser, defaultParserOptions } = require("../");

describe("Parser tests", () => {
  test("Parse Simple", () => {
    const source = `1 2 3 4`;

    const { args: result } = parseArgs(source);

    expect(result).toEqual(["1", "2", "3", "4"]);
  });

  test("Parse Quoted", () => {
    const source = `1 2 (3 4) (5 6`;

    const { args: result } = parseArgs(source);

    expect(result).toEqual(["1", "2", "3 4", "5 6"]);
  });

  test("Long Quotes", () => {
    const source = `1 2 begin3 4end begin5 6`;

    const { args: result } = parseArgs(source, {
      quotes: [["begin", "end"]]
    });

    expect(result).toEqual(["1", "2", "3 4", "5 6"]);
  });

  test("Escape Quoted", () => {
    const source = `1 (((2 \\\\3\\) \\\\4\\))`;

    const { args: result } = parseArgs(source);

    expect(result).toEqual(["1", "((2 \\3) \\4)"]);
  });

  test("Long Escape", () => {
    const source = `1 beginbegin1 2 :long-escape: :long-escape::long-escape:3:long-escape:end 4end`;

    const { args: result } = parseArgs(source, {
      escapeMarkers: [":long-escape:"],
      quotes: [["begin", "end"]]
    });

    expect(result).toEqual(["1", "begin1 2 :long-escape: :long-escape:3end 4"]);
  });

  test("Parse Empty", () => {
    const source = `1 2 ~ 3 ~ 4`;

    const { args: result } = parseArgs(source);

    expect(result).toEqual(["1", "2", undefined, "3", undefined, "4"]);
  });

  test("Parse Flags", () => {
    const source = `-f --ff=1 - (flag name) = (flag value) -  x    = 2   --    y =   "3"`;

    const { flags: result } = parseArgs(source);

    expect(result).toEqual({
      f: true,
      ff: "1",
      "flag name": "flag value",
      x: "2",
      y: "3"
    });
  });

  test("Parse Array Flag", () => {
    const source = `-f = 1 -f = 2 -f = 3`;

    const { flags: result } = parseArgs(source);

    expect(result).toEqual({
      f: ["1", "2", "3"]
    });
  });

  test("Parse Complex", () => {
    const source = `--test -x = 3 sample (q u o t e d) -f = 1 ~ (complex command) -f = 2 --with = (complex flags) --f ~ and -empty-one=~ :: rest -rest`;

    const result = parseArgs(source);

    expect(result).toEqual({
      args: [
        "sample",
        "q u o t e d",
        undefined,
        "complex command",
        undefined,
        "and",
        " rest -rest"
      ],
      flags: {
        test: true,
        x: "3",
        f: ["1", "2", true],
        with: "complex flags",
        "empty-one": undefined
      }
    });
  });

  test("Parse Blank", () => {
    const source = `    `;

    const result = parseArgs(source);

    expect(result).toEqual({ args: [], flags: {} });
  });

  test("Parse Rest", () => {
    const source = `arg1 arg2 -f = x ::arg2 arg3 :: -y = z`;

    const result = parseArgs(source);

    expect(result).toEqual({
      args: ["arg1", "arg2", "arg2 arg3 :: -y = z"],
      flags: { f: "x" }
    });
  });

  test("Parse Empty Args", () => {
    const source = ``;

    const result = parseArgs(source);

    expect(result).toEqual({
      args: [],
      flags: {}
    });
  });

  test("Parse Command", () => {
    const source = `npm i -D typescript`;

    const result = parseCommand(source);

    expect(result).toEqual({
      name: "npm",
      args: ["i", "typescript"],
      flags: { D: true }
    });
  });

  test("Parse Invalid Command", () => {
    const source = ``;

    const result = parseCommand(source);

    expect(result).toBe(null);
  });

  test("Parser Reset", () => {
    const source = "npm i -D typescript";

    const parser = new Parser(source, defaultParserOptions);

    const result1 = parser.command();

    parser.reset();

    const result2 = parser.command();

    expect(result1).toEqual(result2);
  });

  test("Parse Invalid Flag", () => {
    const source = "--";

    const parser = new Parser(source, defaultParserOptions);

    const result = parser.flag();

    expect(result).toBe(null);
  });

  test("Parse Without Options", () => {
    const source = "npm i -D typescript ~";

    const parser = new Parser(source, {});

    const result = parser.command();

    expect(result).toEqual({
      name: source,
      parts: []
    });
  });

  test("Parse Complex (Regexp Lexemes)", () => {
    const options = {
      quotes: [/"/, [/\(/, /\)/]],
      flagMarkers: [/--/, /-/],
      flagValueMarkers: [/=/],
      emptyArgMarkers: [/~/],
      escapeMarkers: [/\\/],
      separators: [/ /, /\n/, /\r/, /\t/],
      restMarkers: [/::/]
    };

    const source = `--test -x = 3 sample (q u o t e d) -f = 1 ~ (complex command) -f = 2 --with = (complex flags) --f ~ and -empty-one=~ :: rest -rest`;

    const result = parseArgs(source);

    expect(result).toEqual({
      args: [
        "sample",
        "q u o t e d",
        undefined,
        "complex command",
        undefined,
        "and",
        " rest -rest"
      ],
      flags: {
        test: true,
        x: "3",
        f: ["1", "2", true],
        with: "complex flags",
        "empty-one": undefined
      }
    });
  });

  test("Parse Complex (Modified Regexp Lexemes)", () => {
    const options = {
      quotes: [/"/, [/\(/, /\)/]],
      flagMarkers: [/--?/],
      flagValueMarkers: [/=/],
      emptyArgMarkers: [/~/],
      escapeMarkers: [/\\/],
      separators: [/\s+/],
      restMarkers: [/::/]
    };

    const source = `--test -x = 3 sample (q u o t e d) -f = 1 ~ (complex command) -f = 2 --with = (complex flags) --f ~ and -empty-one=~ :: rest -rest`;

    const result = parseArgs(source);

    expect(result).toEqual({
      args: [
        "sample",
        "q u o t e d",
        undefined,
        "complex command",
        undefined,
        "and",
        " rest -rest"
      ],
      flags: {
        test: true,
        x: "3",
        f: ["1", "2", true],
        with: "complex flags",
        "empty-one": undefined
      }
    });
  });
});

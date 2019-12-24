const { parse } = require("../");

describe("Parser tests", () => {
  test("Parse Simple", () => {
    const source = `1 2 3 4`;

    const { args: result } = parse(source);

    expect(result).toEqual(["1", "2", "3", "4"]);
  });

  test("Parse Quoted", () => {
    const source = `1 2 (3 4) (5 6`;

    const { args: result } = parse(source);

    expect(result).toEqual(["1", "2", "3 4", "5 6"]);
  });

  test("Long Quotes", () => {
    const source = `1 2 begin3 4end begin5 6`;

    const { args: result } = parse(source, {
      quotes: [["begin", "end"]]
    });

    expect(result).toEqual(["1", "2", "3 4", "5 6"]);
  });

  test("Escape Quoted", () => {
    const source = `1 (((2 \\\\3\\) \\\\4\\))`;

    const { args: result } = parse(source);

    expect(result).toEqual(["1", "((2 \\3) \\4)"]);
  });

  test("Long Escape", () => {
    const source = `1 beginbegin1 2 :long-escape::long-escape:3:long-escape:end 4end`;

    const { args: result } = parse(source, {
      escapeMarkers: [":long-escape:"],
      quotes: [["begin", "end"]]
    });

    expect(result).toEqual(["1", "begin1 2 :long-escape:3end 4"]);
  });

  test("Parse Empty", () => {
    const source = `1 2 ~ 3 ~ 4`;

    const { args: result } = parse(source);

    expect(result).toEqual(["1", "2", undefined, "3", undefined, "4"]);
  });

  test("Parse Flags", () => {
    const source = `-f --ff=1 - (flag name) = (flag value) -  x    = 2   --    y =   "3"`;

    const { flags: result } = parse(source);

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

    const { flags: result } = parse(source);

    expect(result).toEqual({
      f: ["1", "2", "3"]
    });
  });

  test("Parse Complex", () => {
    const source = `--test -x = 3 sample -f = 1 ~ (complex command) -f = 2 --with = (complex flags) --f ~ and -empty-one=~`;

    const result = parse(source);

    expect(result).toEqual({
      args: ["sample", undefined, "complex command", undefined, "and"],
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

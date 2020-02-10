const { createFlagObject } = require("../");

const flag = (name, value) => ({ name, value });

describe("Flag Object Tests", () => {
  const flags = [
    flag("alpha", "1"),
    flag("beta", undefined),
    flag("gamma", "2"),
    flag("alpha", undefined),
    flag("BETA", "3")
  ];

  test("Single Case Sensitive Flags", () => {
    const flagObject = createFlagObject(flags, {
      allowArrayValues: false,
      caseInsensitiveFlags: false
    });

    expect(flagObject).toEqual({
      alpha: "1",
      beta: undefined,
      gamma: "2",
      BETA: "3"
    });
  });

  test("Array Case Sensitive Flags", () => {
    const flagObject = createFlagObject(flags, {
      allowArrayValues: true,
      caseInsensitiveFlags: false
    });

    expect(flagObject).toEqual({
      alpha: ["1", undefined],
      beta: undefined,
      gamma: "2",
      BETA: "3"
    });
  });

  test("Single Case Insensitive Flags", () => {
    const flagObject = createFlagObject(flags, {
      allowArrayValues: false,
      caseInsensitiveFlags: true
    });

    expect(flagObject).toEqual({
      alpha: "1",
      beta: undefined,
      gamma: "2"
    });

    expect(flagObject.ALPHA).toEqual(flagObject.alpha);

    expect("ALPHA" in flagObject).toBeTruthy();
  });

  test("Array Case Insensitive Flags", () => {
    const flagObject = createFlagObject(flags, {
      allowArrayValues: true,
      caseInsensitiveFlags: true
    });

    expect(flagObject).toEqual({
      alpha: ["1", undefined],
      beta: [undefined, "3"],
      gamma: "2"
    });

    expect(flagObject.GAMMA).toEqual(flagObject.gamma);

    expect("GAMMA" in flagObject).toBeTruthy();
  });
});

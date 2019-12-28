import { RichParserOptions } from "./RichParserOptions";
import { FlagObjectOptions, buildFlagObject } from "./buildFlagObject";
import { defaultRichParserOptions } from "./constants";
import { RichArgv } from "./types/types";
import { RichParser } from "./RichParser";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";
import { buildRichArgv } from "./buildRichArgv";

/**
 * Parses the source string to a {@link RichArgv}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultRichParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 */
export function parse(
  source: string,
  options: RichParserOptions & FlagObjectOptions = {}
): RichArgv {
  const parser = new RichParser(source, {
    ...defaultRichParserOptions,
    ...options
  });

  const parts = parser.parts();

  return buildRichArgv(parts, options);
}
